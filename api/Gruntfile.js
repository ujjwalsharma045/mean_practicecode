module.exports = function(grunt) {
   grunt.initConfig({
        /*jshint: {			  
              //when this task is run, lint the Gruntfile and all js files in src
			  build: ['Gruntfile.js', 'public/js/*.js' , 'public/css/*.css']
        },*/ 
        uglify:{
			  build:{
				files:{
				  'public/js/angular-local-storage.min.js': 'public/js/angular-local-storage.min.js'
				}
			  }
        },
        /*less: {
			  build: {
				files: {
				  'public/css/angular-awesome-slider.css': 'public/css/angular-awesome-slider.css'
				}
			  }
        },*/
        cssmin: {			  
			  build:{
				files:{
				  'public/css/angular-awesome-slider.css': 'public/css/angular-awesome-slider.css'
				}
			  }
        },		
	    watch: {
			  // for stylesheets, watch css and less files 
			  // only run less and cssmin stylesheets: { 
			  files: ['public/css/*.css'], 
			  tasks: ['less', 'cssmin'] ,
			  // for scripts, run jshint and uglify 
		}		        
   });
   
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-watch');
   
   grunt.registerTask('default', ['uglify', 'cssmin', 'watch']); 
   grunt.registerTask('dev', ['jshint:dev', 'uglify:dev', 'cssmin:dev', 'less:dev']);
   grunt.registerTask('production', ['jshint:production', 'uglify:production', 'cssmin:production', 'less:production']);
}