
import { getAuth } from "firebase/auth";

export async function getJWT() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  } else {
    throw new Error("No user logged in");
  }
}
