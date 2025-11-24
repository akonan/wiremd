class Wiremd < Formula
  desc "Text-first UI design tool - Create wireframes using Markdown"
  homepage "https://github.com/akonan/wiremd"
  url "https://registry.npmjs.org/wiremd/-/wiremd-0.1.5.tgz"
  sha256 "a270d272281c20c532677c363380a67561d9e650ad3015f49fc3a264be5e1f26"
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
