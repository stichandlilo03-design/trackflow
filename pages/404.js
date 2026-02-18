import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Page Not Found — TrackFlow</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        <div className="text-6xl mb-6 opacity-30">📦</div>
        <h1 className="font-mono text-3xl font-bold text-dark-50 mb-3">
          Page Not Found
        </h1>
        <p className="text-dark-400 text-base mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist. If you&apos;re trying to track a shipment, head back to the homepage.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm px-8 py-3 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all no-underline"
        >
          ← Track a Shipment
        </Link>
      </div>
    </Layout>
  );
}
