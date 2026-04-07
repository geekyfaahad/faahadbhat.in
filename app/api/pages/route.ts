import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { serverDb, serverStorage } from "../../../lib/firebaseServer";

const PAGES_COLLECTION = "pages";

export async function POST(req: Request) {
  try {
    const { slug, files } = await req.json();

    const existing = await getDocs(
      query(collection(serverDb, PAGES_COLLECTION), where("slug", "==", slug))
    );
    if (!existing.empty) {
      return NextResponse.json(
        { error: `A page with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const uploadedFiles = [];
    for (const file of files) {
      const storageRef = ref(serverStorage, `pages/${slug}/${file.path}`);
      const uint8 = new Uint8Array(file.content);
      const blob = new Blob([uint8], {
        type: file.type || "application/octet-stream",
      });
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      uploadedFiles.push({
        path: file.path,
        url,
        type: file.type,
        size: uint8.byteLength,
      });
    }

    const docRef = await addDoc(collection(serverDb, PAGES_COLLECTION), {
      slug,
      files: uploadedFiles,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, slug, files: uploadedFiles });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create page", details: String(error) },
      { status: 500 }
    );
  }
}
