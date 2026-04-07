import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { serverDb } from "../../../lib/firebaseServer";

const BLOG_COLLECTION = "blogPosts";

export async function POST(req: Request) {
  try {
    const postData = await req.json();
    const docRef = await addDoc(collection(serverDb, BLOG_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post", details: String(error) },
      { status: 500 }
    );
  }
}
