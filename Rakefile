require 'haml'
require 'fileutils'
require 'fssm'

def haml file
	dir_name  = File.dirname(file)
	out_name  = File.basename(file,'.haml') + ".html"
	%x{ haml #{file} #{File.join(dir_name, out_name)} }
end

def haml_watcher
	FSSM.monitor do
		
		path './' do
			glob '**/*.haml'

			update do |base, relative|
				haml File.join(base,relative)
			end

			create do |base, relative|
				haml File.join(base,relative)
			end
		end

	end
end

desc 'Build haml files'
task :build_haml do
	Dir.glob("./**/*.haml") do |file|
		haml(file)
	end
end

desc 'Build sass files'
task :build_sass do
	sh "sass --update sass:css"
end

desc 'Build all haml and sass files then build jekyll site'
task :build => [:build_sass, :build_haml] do
	sh "jekyll build"
end

desc 'Clean all the files'
task :clean do
	if File.exist?('./_site') then FileUtils.rm_rf './_site' end
	if File.exist?('./css')   then FileUtils.rm_rf './css' end
	FileUtils.rm Dir.glob('./**/*.html')
end

desc "Launch Jekyll server"
task :serve => :build do
	haml  = Thread.new { haml_watcher }
	server = Thread.new { sh "jekyll serve -w"}
	sass = Thread.new { sh "sass --watch sass:css" }
	haml.join
	server.join
	sass.join

	trap "INT" do
		Thread.kill (haml)
		Thread.kill (sass)
		Thread.kill (server)
	end
end
