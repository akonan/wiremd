class Wiremd < Formula
  desc "Text-first UI design tool - Create wireframes using Markdown"
  homepage "https://github.com/akonan/wiremd"
  url "https://registry.npmjs.org/wiremd/-/wiremd-0.1.3.tgz"
  sha256 "613e13df68b3053b822702b0718a07a63605b5f1b97d4f4b2b845a735ef23fbc"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # Test that the command runs and shows version
    assert_match "wiremd", shell_output("#{bin}/wiremd --version")

    # Create a test markdown file
    (testpath/"test.md").write <<~EOS
      # Test Wireframe

      ## Button
      [Click Me]
    EOS

    # Generate HTML
    system bin/"wiremd", "test.md", "-o", "test.html"
    assert_predicate testpath/"test.html", :exist?
  end
end
