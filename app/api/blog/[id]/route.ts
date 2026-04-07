import { NextResponse } from "next/server";
import { deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { serverDb } from "../../../../lib/firebaseServer";

const BLOG_COLLECTION = "blogPosts";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const postRef = doc(serverDb, BLOG_COLLECTION, id);
    await updateDoc(postRef, {
      ...body,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postRef = doc(serverDb, BLOG_COLLECTION, id);
    await deleteDoc(postRef);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post", details: String(error) },
      { status: 500 }
    );
  }
}
