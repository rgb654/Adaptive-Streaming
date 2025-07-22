import VideoPlayer from "../components/Video/VideoPlayer";
import Layout from "../components/Layout/Layout";

export default function Watch() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <VideoPlayer />
      </div>
    </Layout>
  );
}