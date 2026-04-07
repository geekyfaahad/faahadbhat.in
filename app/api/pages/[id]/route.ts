import { NextResponse } from "next/server";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import { serverDb, serverStorage } from "../../../../lib/firebaseServer";

const PAGES_COLLECTION = "pages";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { slug } = await req.json();

    if (slug) {
      const storageRef = ref(serverStorage, `pages/${slug}`);
      try {
        const fileList = await listAll(storageRef);
        await Promise.all(fileList.items.map((item) => deleteObject(item)));
        for (const prefix of fileList.prefixes) {
          const sub = await listAll(prefix);
          await Promise.all(sub.items.map((item) => deleteObject(item)));
        }
      } catch {
        // Ignore storage cleanup errors and continue document delete.
      }
    }

    await deleteDoc(doc(serverDb, PAGES_COLLECTION, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete page", details: String(error) },
      { status: 500 }
    );
  }
}
