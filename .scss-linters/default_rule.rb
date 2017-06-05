module SCSSLint
  # Reports the use of !important in properties.
  class Linter::DefaultRule < Linter
    include LinterRegistry

    def visit_variable(node)
      return if source_from_range(node.source_range).include?('!default')

      add_lint(node, '!default should be used')
    end
  end
end