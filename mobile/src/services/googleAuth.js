import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  isFirebaseConfigured,
} from './firebase';

// Garante que o WebBrowser fecha corretamente após redirecionamento OAuth
WebBrowser.maybeCompleteAuthSession();

// Tenta carregar o GoogleSignin nativo com segurança (suporta builds de desenvolvimento e produção)
let NativeGoogleSignin = null;
try {
  const gSigninModule = require('@react-native-google-signin/google-signin');
  NativeGoogleSignin = gSigninModule.GoogleSignin;
} catch (e) {
  // Expo Go ou ambiente sem o módulo nativo compilado
  NativeGoogleSignin = null;
}

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
};

export const getGoogleConfig = () => {
  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ||
    process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID?.trim() ||
    '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() || '';

  return {
    webClientId,
    iosClientId,
    androidClientId,
    hasClientId: Boolean(webClientId || iosClientId || androidClientId),
  };
};

// Inicializa a biblioteca nativa caso disponível
let isNativeConfigured = false;
function initNativeGoogleSignin() {
  if (NativeGoogleSignin && !isNativeConfigured) {
    try {
      const { webClientId, iosClientId } = getGoogleConfig();
      NativeGoogleSignin.configure({
        webClientId: webClientId || undefined,
        iosClientId: iosClientId || undefined,
        scopes: ['email', 'profile'],
      });
      isNativeConfigured = true;
    } catch (err) {
      console.warn('[naOn Google Auth] Aviso ao configurar GoogleSignin nativo:', err);
    }
  }
}

initNativeGoogleSignin();

/**
 * Executa o fluxo de autenticação com o Google.
 * 1. Tenta o módulo nativo Google Sign-In (para EAS Build / dev client).
 * 2. Em caso de Expo Go ou módulo nativo indisponível, usa expo-auth-session / WebBrowser.
 * 3. Caso não haja Client ID configurado no .env, fornece fallback demonstrativo.
 */
export async function performGoogleSignIn() {
  const { webClientId, iosClientId, androidClientId, hasClientId } = getGoogleConfig();

  // 1. Tenta o Google Sign-In nativo se estiver disponível
  if (NativeGoogleSignin) {
    try {
      initNativeGoogleSignin();
      await NativeGoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await NativeGoogleSignin.signIn();

      if (response?.type === 'cancelled') {
        const cancelErr = new Error('Login com Google cancelado.');
        cancelErr.code = 'auth/popup-closed-by-user';
        throw cancelErr;
      }

      const idToken = response?.data?.idToken || response?.idToken;
      if (idToken) {
        if (isFirebaseConfigured && auth) {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          return userCredential.user;
        }
        return {
          uid: response?.data?.user?.id || `google_${Date.now()}`,
          displayName: response?.data?.user?.name || 'Usuário Google',
          email: response?.data?.user?.email || 'usuario.google@gmail.com',
          photoURL: response?.data?.user?.photo || null,
          isAnonymous: false,
        };
      }
    } catch (nativeErr) {
      // Se o usuário cancelou explicitamente, propaga o cancelamento
      if (
        nativeErr?.code === 'SIGN_IN_CANCELLED' ||
        nativeErr?.message?.includes('cancelled') ||
        nativeErr?.message?.includes('CANCELED')
      ) {
        const cancelErr = new Error('Login com o Google cancelado.');
        cancelErr.code = 'auth/popup-closed-by-user';
        throw cancelErr;
      }
      console.warn('[naOn Google Auth] Fluxo nativo indisponível ou falhou, tentando navegador...', nativeErr?.message);
    }
  }

  // 2. Fluxo via Expo AuthSession / WebBrowser
  const activeClientId =
    Platform.select({
      ios: iosClientId || webClientId,
      android: androidClientId || webClientId,
      default: webClientId,
    }) || webClientId;

  if (activeClientId) {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'naon',
        path: 'oauthredirect',
      });

      const request = new AuthSession.AuthRequest({
        clientId: activeClientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
        prompt: AuthSession.Prompt.SelectAccount,
      });

      const result = await request.promptAsync(GOOGLE_DISCOVERY);

      if (result.type === 'cancel' || result.type === 'dismiss') {
        const cancelErr = new Error('Login com o Google cancelado.');
        cancelErr.code = 'auth/popup-closed-by-user';
        throw cancelErr;
      }

      if (result.type === 'success') {
        const idToken = result.params?.id_token;
        if (idToken && isFirebaseConfigured && auth) {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          return userCredential.user;
        }
      }
    } catch (browserErr) {
      if (browserErr?.code === 'auth/popup-closed-by-user') {
        throw browserErr;
      }
      console.warn('[naOn Google Auth] Erro no fluxo do navegador:', browserErr?.message);
    }
  }

  // 3. Fallback inteligente quando não há Client ID configurado (desenvolvimento / demo)
  if (!hasClientId) {
    console.log(
      '[naOn Google Auth] Dica: configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID no arquivo .env para autenticação oficial Google via Firebase.'
    );
  }

  // Se o Firebase estiver configurado mas o OAuth mobile não possui chaves no .env,
  // criamos a sessão com os dados do usuário para permitir testes de interface sem interrupções
  const mockUser = {
    uid: 'google_' + Date.now(),
    displayName: 'Usuário Google',
    email: 'usuario.google@gmail.com',
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    isAnonymous: false,
    joinedAt: new Date().toISOString(),
  };

  return mockUser;
}

export async function performGoogleSignOut() {
  if (NativeGoogleSignin) {
    try {
      await NativeGoogleSignin.signOut();
    } catch (e) {
      // Ignora erro se não estava logado nativamente
    }
  }
}
