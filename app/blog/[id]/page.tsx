"use client";

import { useParams } from "next/navigation";
import { BlogPost } from "../../../src/components/BlogPost";

export default function Page() {
  const params = useParams<{ id: string }>();
  return <BlogPost id={params.id} />;
}
