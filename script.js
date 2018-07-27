// ==UserScript==
// @name         Redmine Story Point Display
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shows the sum of Story Points in columns which contains subtasks
// @author       Marc Bohm
// @match        http://tampermonkey.net/index.php?version=4.6&ext=dhdg&updated=true
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(function() {

        var tickets_in_ready_for_dev;
        var storypoints
        var backlog = [];
        var tickets_in_bereit_fuer_entwicklung;
        var backlog_subtasks = [];
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

        // build array of tickets of column "Bereit für Entwicklung" und "bearbeiten"


        tickets_in_bereit_fuer_entwicklung = document.querySelectorAll("div[data-column-name='Bereit für Entwicklung']")[0].childNodes
        for (var j = 0; j < tickets_in_bereit_fuer_entwicklung.length; j++) {
            tmp_string = tickets_in_bereit_fuer_entwicklung[j].innerText;
            ticket_number = tmp_string.substring(tmp_string.lastIndexOf('[') + 1, tmp_string.lastIndexOf(']')).replace("#", "");
            subtask_number = tmp_string.substring(1, 5);

            backlog_subtasks.push([ticket_number, 0, subtask_number]);
        }

        // check if ticketnumber of an item in array "backlog" is also in the title of an index of "Bereit für Entwicklung"
        for (i = 0; i < backlog.length; i++) {
            for (j = 0; j < backlog_subtasks.length; j++) {
                if (backlog[i][0] == backlog_subtasks[j][0]) {
                    backlog_subtasks[j][1] = backlog[i][1];

                }
            }
        }

        //calcuate points in "Bereit für Entwicklung"
        for(i=0;i<backlog_subtasks.length;i++){
          if(backlog_subtasks[i][1] != "—"){
              storypoints_second_row = storypoints_second_row + parseInt(backlog_subtasks[i][1]);
          }
        }

        //do the same for all other columns


        console.log(storypoints_second_row + " Storypoints sind bereit für die Entwicklung");
        var endresult = document.querySelectorAll("#scrum-sprint-container > div.agile > div > div.easy-col.col1.agile__main-col.agile__col > div > div > div > div.agile__col.sprint-col.col0 > div.agile__col__title.sticky > div > span.agile__col__title__details")
        var html = endresult[0].innerText;
        endresult[0].innerText += (" " + storypoints_second_row);
        },
               5500);


})();
