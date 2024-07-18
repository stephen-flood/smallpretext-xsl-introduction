var ptx_lunr_search_style = "textbook";
var ptx_lunr_docs = [
{
  "id": "frontmatter-2",
  "level": "1",
  "url": "frontmatter-2.html",
  "type": "Colophon",
  "number": "",
  "title": "Colophon",
  "body": "  My Website   copyright  "
},
{
  "id": "my-great-book-4",
  "level": "1",
  "url": "my-great-book-4.html",
  "type": "Chapter",
  "number": "1",
  "title": "Understanding XSL Conversion",
  "body": " Understanding XSL Conversion   First, obtain a copy of xlstproc . For windows, install WSL as in the documentation.    Two types of files  Create two text files, exam.xsl and exam3.xml . In  The stylesheet exam.xsl will contain the program for converting the contents of exam3.xml , which is the input. Each file requires a specific format:   Stylesheet file  There must be a single outermost environment, which requires a very specific format.  <xsl:stylesheet xmlns:xsl=\"http:\/\/www.w3.org\/1999\/XSL\/Transform\" version=\"1.0\">  <\/xsl:stylesheet>      XML Input  There must be a single outermost environment. It can be anything, but here we pick exam and question . Again, the elements can have any attributes you like. Here we use @points   <exam>  <question points=\"5\">  What is pi?  <\/question>  <question>  2+2?  <\/question>  <question points=\"20\">  Do You <em>Love<\/em> Pretext?  <\/question>  <\/exam>         A first XML stylesheet  Our first goal is to create a stylesheet that ignores the content of exam3.xml .     The xml environment xsl:template defines a template. At each point in the conversion, xsltproc uses its internal logic to select which template it should be using, based on the match attributes of the templates defined.    match=\"*\" matches everything,     match=\"\/\" matches only the root noted,     match=\"question\" will match question environments.       The xml environment xsl:text instructs xsltproc to ouptut the contents of the environment.     The command  Add the following code to exam.xsl   <xsl:template match=\"\/\">  <xsl:text>  Hello World!  <\/xsl:text>  <\/xsl:template >    Now run xsltproc exam.xsl exam3.xml . Look at what is printed.    Applying Default Templates     The xml:apply-templates environment recursively calls the stylesheet. Under most circumstances, the recursive call is on some subset of the children of the current node of the document tree. The exact nodes that are matched is specified by the select attribute.        select=\"*\" matches all children of the current node that are elements (but excludes text nodes and attributes).     select=\"exam\" matches only children of the current node that are elements of type \"exam\".     select=\"text()\" selects only text nodes (but excludes element nodes and attributes)     select=\"node()\" selects all children including text ones (but excludes attributes). Note that \"node()\" is the same as \"*|text\"     Using <apply-templates \/> with no select attribute is equivalent to using select=\"node()\"         In exam.xsl , delete everything inside the <xsl:template match=\"\/\"> tags, and replace it with <xsl:apply-templates\/> . exam.xsl should now have the following contents:  <xsl:stylesheet xmlns:xsl=\"http:\/\/www.w3.org\/1999\/XSL\/Transform\" version=\"1.0\">  <xsl:template match=\"\/\">  <xsl:apply-templates select=\"*\" \/>  <\/xsl:template >  <\/xsl:stylesheet>    Now run xsltproc exam.xsl exam3.xml . Look at what is printed.    Additional Templates   xsltproc has default templates, which are matched if nothing in the stylesheet apply. To get your desired output, we will create our own templates that define output behaviour for the environments where they match. (If multiple templates match, the more specific template is generally used).      You can use xsl:text to enter fixed text that should appear in your ouput. For example, if you are outputting a latex document, you may want it to begin with the text string \\documentclass{article}\\begin{document} and to end with the text string \\end{document}    &#xa; inserts ASCII for a line break in the output.    You can use xsl:number to insert the (output of) a counter for the current object.    You can use xsl:value-of to insert the value of an attribute for the current element. Use select=\"@points\" will have this output the value of the points attribute of the current element.    Not every element will have all attributes defined. You should check if the attribute is defined before you reference it. The code below will ensure that the points attribute is defined before trying to insert it.  <xsl:if test=\"@points\">  <xsl:value-of select=\"@points\"><\/xsl:value-of>  <\/xsl:if>          Add three templates to exam.xsl that match \"exam,\" and \"question,\" and \"em\".   For the exam template, have it insert latex to begin and end a document.    For the problem template, have it output a question tag, and insert the appropriate number of points.    For the em template, have it insert latex to emphasize the enclosed text.      <xsl:stylesheet xmlns:xsl=\"http:\/\/www.w3.org\/1999\/XSL\/Transform\" version=\"1.0\">   <xsl:template match=\"\/\">  <xsl:apply-templates select=\"*\" \/>  <\/xsl:template >   <xsl:template match=\"exam\">  <xsl:text>  \\begin{document}  &#xa;  <\/xsl:text>  <xsl:apply-templates select=\"*\"\/>  <xsl:text>  \\end{document}  &#xa;  <\/xsl:text>  <\/xsl:template>   <xsl:template match=\"question\">  <xsl:text>Question #<\/xsl:text>  <xsl:number\/>  <xsl:if test=\"@points\">  <xsl:text> [<\/xsl:text>  <xsl:value-of select=\"@points\"><\/xsl:value-of>  <xsl:text>]<\/xsl:text>  <\/xsl:if>  <xsl:text>. <\/xsl:text>  <xsl:apply-templates \/>  <xsl:text>&#xa; <\/xsl:text>  <\/xsl:template>   <xsl:template match=\"em\">  <xsl:text>\\emph{<\/xsl:text>  <xsl:apply-templates\/>  <xsl:text>}<\/xsl:text>  <\/xsl:template>  <\/xsl:stylesheet>     Linking Your Stylesheet to PreTeXt  You probably want to use your new stylesheet together with an existing PreTeXt stylesheet. If you are using the CLI, you will need to make edits in two or three three places: placing your stylesheet in the sub directory xsl\/ of the pretext project, creating a new build target in project.ptx , and (possibly) creating a new publication file.     XSL file  Move the stylesheet you have written to the xsl\/ directory.  You are (probably) writing XSL to extend an existing pretext stylesheet, rather than writing a whole new one from scratch. To do this, add a version of the following as the second line of your xsl file.  <xsl:import href=\".\/core\/pretext-html.xsl\"\/>  The snippet above will extend the pretext-html stylesheet that produces web output. Use a different stylesheet to extend print, slides, etc.    Defining output profile  In project.ptx , you will need to define a new output profile. To do this, insert the following line.   <target name=\"new-target\" format=\"custom\" xsl=\"exam.xsl\" \/>   Use the name of your xsl file in the @xsl attribute of the build profile.    Creating new publisher file  You can also (optionally) create a new publisher file which you reference from the new output file above.       Advanced XSL concepts  From a certain perspective, you can think of xsl: commands from an object oriented perspective.  In portions of the pretext xsl, the @mode attribute can be thought of as a function on the element that is selected. For example, in the PreTeXt stylesheets, the xsl element  <xsl:apply-templates select=\".\" mode=\"title-full\" \/>  causes the \"full\" version of the title of the current element to be returned. To instruct latex to print a bold version of the text, you would instead use  <xsl:text>\\textbf{<\/xsl:text>  <xsl:apply-templates select=\".\" mode=\"title-full\" \/>  <xsl:text>}<\/xsl:text>     "
},
{
  "id": "backmatter-2",
  "level": "1",
  "url": "backmatter-2.html",
  "type": "Colophon",
  "number": "",
  "title": "Colophon",
  "body": " This book was authored in PreTeXt .  "
}
]

var ptx_lunr_idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('body')
  this.metadataWhitelist = ['position']

  ptx_lunr_docs.forEach(function (doc) {
    this.add(doc)
  }, this)
})
