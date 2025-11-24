class Wiremd < Formula
  desc "Text-first UI design tool - Create wireframes using Markdown"
  homepage "https://github.com/akonan/wiremd"
  url "https://registry.npmjs.org/wiremd/-/wiremd-0.1.4.tgz"
  sha256 "b691070868d50a97d19a8696921c5db8ff4746b3bb7c82cff5f08b937e98bb10"
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
