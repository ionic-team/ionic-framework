module SCSSLint
  # Reports the use of !default at the end of variable declarations.
  class Linter::DefaultRule < Linter
    include LinterRegistry

    def visit_function(node)
      return true
    end

    def visit_variable(node)
      return if source_from_range(node.source_range).include?('!default')

      return unless node_ancestor(node, 2).nil?

      add_lint(node, '!default should be used')
    end
  end
end