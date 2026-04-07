"use client";

import { useParams } from "next/navigation";
import { PageViewer } from "../../src/components/PageViewer";

export default function Page() {
  const params = useParams<{ slug: string }>();
  return <PageViewer slug={params.slug} />;
}
