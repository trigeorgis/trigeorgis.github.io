require 'bibtex'
require 'yaml'

module Jekyll

  class Paper < Liquid::Drop
    attr_reader :title, :authors, :bibtex, :where, :year, :url, :pdf, :supp

    def initialize(site, paper)
      bibtex = BibTeX.parse(paper['bibtex'])[0]

      @url = paper['url']
      @bibtex = bibtex.to_s

      bibtex = bibtex.convert(:latex)

      @year = bibtex.year
      @title = bibtex.title
      @pdf = paper['pdf']
      @supp = paper['supp']
      @authors = bibtex.author.map{|a| 
        p = a.split(',') 
        "#{p[1][0..1]}. #{p[0]}"
      }.join(', ') 

      @where = bibtex.booktitle ? bibtex.booktitle : bibtex.journal
    end

    def inspect
      "#<Jekyll::Paper @title=#{@title}>"
    end
  end

  class PaperGenerator < Generator
    safe true

    def generate(site)
      dir = site.config['paper_dir'] || '_papers'
      #bib = BibTeX.open(File.join(dir, "bibliography.bib"))
      yaml = YAML.load_file(File.join(dir, 'papers.yaml'))

      site.data['papers'] = yaml.map{|p|
        Paper.new(site, p)
      }

      print site.data['papers']
    end
  end

end
