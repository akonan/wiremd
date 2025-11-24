class Wiremd < Formula
  desc "Text-first UI design tool - Create wireframes using Markdown"
  homepage "https://github.com/akonan/wiremd"
  url "https://registry.npmjs.org/wiremd/-/wiremd-0.1.1.tgz"
  sha256 "86685322b7af349ac57fe1af5027e8b4924ded1b7d2d692e08dfc0787159d948"
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
