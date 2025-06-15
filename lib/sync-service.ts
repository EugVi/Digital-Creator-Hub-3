
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export class SyncService {
  private user: any = null

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.user = user
    })
  }

  async isOnlineStatus(): Promise<boolean> {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  async checkUserExists(): Promise<boolean> {
    if (!this.user) return false
    const docRef = doc(db, 'users', this.user.uid)
    const docSnap = await getDoc(docRef)
    return docSnap.exists()
  }

  async saveData(key: string, data: any): Promise<void> {
    if (!this.user) throw new Error('Usuário não autenticado')
    await setDoc(doc(db, 'users', this.user.uid, key, 'data'), { data })
  }

  async getData(key: string): Promise<any | null> {
    if (!this.user) return null
    const docRef = doc(db, 'users', this.user.uid, key, 'data')
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data().data : null
  }
}
