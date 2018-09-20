// ==UserScript==
// @name         Redmine Story Point Display
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Shows the sum of Story Points in columns which contains subtasks
// @author       Marc Bohm
// @match        http://tampermonkey.net/index.php?version=4.6&ext=dhdg&updated=true
// @grant        none
// @updateUrl    https://github.com/jsnx/redmine_storypoints_calc/blob/master/script.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(function() {

            var tickets_in_ready_for_dev;
            var storypoints;
            var backlog = [];
            var child_container;
            var backlog_bereit_fuer_entwicklung = [];
            var backlog_bearbeiten = [];
            var backlog_codereview = [];
            var tmp_string;
            var ticket_number;
            var subtask_number;
            var storypoints_second_row = 0;

            //backlog => build array of tickets including ticketnumber and storypoints. serves as source for calculations
            tickets_in_ready_for_dev = document.getElementsByClassName("backlog-column agile__list")[0].childNodes;
            for (var i = 0; i < document.getElementsByClassName("backlog-column agile__list")[0].childNodes.length; i++) {

                var childnode = document.getElementsByClassName("backlog-column agile__list")[0].childNodes[i]
                var classname = childnode.className;
                classname = classname.replace("agile__item item_", "")
                storypoints = childnode.getElementsByClassName("agile__card__summable")[0].innerText;
                backlog.push([classname, storypoints]);
            }

            build_backlogs("Bereit für Entwicklung");
            build_backlogs("Bearbeiten");

            remove_duplicates(backlog_bearbeiten, backlog_bereit_fuer_entwicklung);
            write_points(backlog, backlog_bereit_fuer_entwicklung);
            write_points(backlog, backlog_bearbeiten);

            calculate_backlog_points(backlog_bereit_fuer_entwicklung);
            calculate_backlog_points(backlog_bearbeiten);

//======================== functions =====================//

            // build array of tickets of column "Bereit für Entwicklung" und "bearbeiten"
            function build_backlogs(column_name) {
                //build querySelector
                var selector = "div[data-column-name='" + column_name + "']";

                child_container = document.querySelectorAll(selector)[0].childNodes;
                for (var j = 0; j < child_container.length; j++) {
                    tmp_string = child_container[j].innerText;
                    ticket_number = tmp_string.substring(tmp_string.lastIndexOf('[') + 1, tmp_string.lastIndexOf(']')).replace("#", "");
                    subtask_number = tmp_string.substring(1, 5);
                    if (column_name == "Bereit für Entwicklung") {
                        backlog_bereit_fuer_entwicklung.push([ticket_number, 0, subtask_number]);
                    } else {
                        backlog_bearbeiten.push([ticket_number, 0, subtask_number]);
                    }
                }
            }
            // check if ticketnumber of an item in array "backlog" is also in the title of an index of "Bereit für Entwicklung"
            function write_points(original_backlog, column_backlog) {
                for (i = 0; i < original_backlog.length; i++) {
                    for (var j = 0; j < column_backlog.length; j++) {
                        if (original_backlog[i][0] == column_backlog[j][0]) {
                            column_backlog[j][1] = original_backlog[i][1];
                        }
                    }
                }
            };


            function remove_duplicates(original_backlog, column_backlog) {
              for (i = 0; i < original_backlog.length; i++) {

                  for (var j = 0; j < column_backlog.length; j++) {

                      if (original_backlog[i][0] == column_backlog[j][0]) {
                        console.log("Cut out " + original_backlog[i][0]);
                         original_backlog.splice(i,1);
                         --i;
                      }

                  }

              }
            }


            //calcuate points in "Bereit für Entwicklung"
            function calculate_backlog_points(backlog_array) {
                for (i = 0; i < backlog_array.length; i++) {
                    if (backlog_array[i][1] != "—") {
                        storypoints_second_row = storypoints_second_row + parseInt(backlog_array[i][1]);
                    }
                }

                //write to column header
                if (backlog_array == backlog_bereit_fuer_entwicklung) {
                  try{
                    var endresult = document.querySelectorAll("#scrum-sprint-container > div.agile > div > div.easy-col.col1.agile__main-col.agile__col > div > div > div > div.agile__col.sprint-col.col0 > div.agile__col__title.sticky > div > span.agile__col__title__details")
                    var html = endresult[0].innerText;
                    endresult[0].innerText += (" " + storypoints_second_row);
                  }
                  catch(err){
                    console.log(err);
                  }
                } else {
                  try{
                    endresult = document.querySelectorAll("#scrum-sprint-container > div.agile > div > div.easy-col.col1.agile__main-col.agile__col > div > div > div > div.agile__col.sprint-col.col1 > div.agile__col__title.sticky > div > span.agile__col__title__details")
                    html = endresult[0].innerText;
                    endresult[0].innerText += (" " + storypoints_second_row);
                  }
                  catch(err){
                    console.log(err);
                  }
                }

                storypoints_second_row = 0;
            }
        },
        5500);


})();
