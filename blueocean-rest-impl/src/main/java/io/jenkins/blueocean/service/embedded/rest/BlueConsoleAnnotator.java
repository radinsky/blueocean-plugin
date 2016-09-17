package io.jenkins.blueocean.service.embedded.rest;

import hudson.Extension;
import hudson.MarkupText;
import hudson.console.ConsoleAnnotator;
import hudson.console.ConsoleAnnotatorFactory;

import java.util.regex.Pattern;

/**
 * @author Vivek Pandey
 */
public class BlueConsoleAnnotator extends ConsoleAnnotator<Object>{

    private final Pattern mavenStartPattern = Pattern.compile("\\+ mvn (.)*");
    private final Pattern mavenEndPattern = Pattern.compile("^\\[INFO\\] (BUILD FAILURE|BUILD SUCCESS)");
    private final String startMarker = "blueoceanFold:%s:start\n";
    private final String endMarker = "blueoceanFold:%s:end\n";

    private boolean lastButOne;
    int counter;
    @Override
    public ConsoleAnnotator annotate(Object context, MarkupText text) {
        counter++;
        if(mavenStartPattern.matcher(text.getText().trim()).matches()){
            text.addMarkup(0,String.format(startMarker,"Maven Build"));
        }else if(mavenEndPattern.matcher(text.getText().trim()).matches()){
            lastButOne = true;
            return this;
        }
        if(lastButOne){
            text.addMarkup(0,String.format(endMarker,"Maven Build"));
            lastButOne=false;
        }
        return this;
    }

    @Extension
    public static class BlueConsoleAnnotatorFactory extends ConsoleAnnotatorFactory<Object>{

        @Override
        public ConsoleAnnotator newInstance(Object context) {
            return new BlueConsoleAnnotator();
        }
    }
}
