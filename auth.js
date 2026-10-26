import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut,browserLocalPersistence,setPersistence}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import{getFirestore,doc,getDoc,setDoc}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// Pega aquí tu configuración real de Firebase (Configuración del proyecto > Tus apps)
const firebaseConfig={apiKey:"PEGA_TU_API_KEY",authDomain:"ecopuente-c492f.firebaseapp.com",projectId:"ecopuente-c492f",appId:"PEGA_TU_APP_ID"};
export const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
setPersistence(auth,browserLocalPersistence);
export async function loginGoogle(rol){
  const{user}=await signInWithPopup(auth,new GoogleAuthProvider());
  const ref=doc(db,"usuarios",user.uid),s=await getDoc(ref);
  if(!s.exists())await setDoc(ref,{nombre:user.displayName,correo:user.email,rol:rol==="administrador"?"administrador":"usuario"});
  return user;
}
export const logout=()=>signOut(auth);
export function onUser(cb){
  onAuthStateChanged(auth,async u=>{
    if(!u)return cb(null,null);
    let rol="usuario";
    try{const s=await getDoc(doc(db,"usuarios",u.uid));if(s.exists())rol=s.data().rol}catch(e){}
    cb(u,rol);
  });
}
