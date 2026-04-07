import { NextResponse } from "next/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { serverDb } from "../../../../../lib/firebaseServer";

const BLOG_COLLECTION = "blogPosts";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { published } = await req.json();
    const postRef = doc(serverDb, BLOG_COLLECTION, id);
    await updateDoc(postRef, {
      published: Boolean(published),
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update publish state", details: String(error) },
      { status: 500 }
    );
  }
}
