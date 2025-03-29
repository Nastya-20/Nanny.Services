import { database } from "../firebase";
import { ref, set, push } from "firebase/database";

export function addNanny(nannyData) {
  const nannyRef = push(ref(database, "nannies")); 
  return set(nannyRef, nannyData)
    .then(() => {
      console.log("Nanny added successfully!");
    })
    .catch((error) => {
      console.error("Error adding nanny:", error);
    });
}