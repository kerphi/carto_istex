$(document).ready(function(){
  var data3;
   function strReplaceAll(string, Find, Replace) { // fonction de remplacement des espace en underscore
      try {
          return string.replace( new RegExp(Find, "gi"), Replace );       
      } catch(ex) {
          return string;
      }
    }

 function drawSeriesChart() {// fonction qui va créé les bubbles
      var data = google.visualization.arrayToDataTable(data3);
      var options = {
            legend: 'none',
            tooltip:{isHtml:true},
            title: 'BubbleChart of publications per author for query : '+query,
            width:900,
            height:600,
            hAxis: {display:false,
              viewWindowMode:'explicit',
              viewWindow
             :{max:220},
              baselineColor: '#fff',
              gridlineColor: '#fff',
              textPosition: 'none'
            },
            vAxis: {display:false ,viewWindowMode:'explicit',
              viewWindow
             :{max:120},
              baselineColor: '#fff',
              gridlineColor: '#fff',
              textPosition: 'none'
           },
            bubble: {textStyle: {fontSize: 11}},
            
          };

      var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div_authors'));
      chart.draw(data, options);
      $('.command_authors a').remove();
      $('#actions_authors #download').remove();
      $('.command_authors').append('<a href=" '+chart.getImageURI() +'" download=authors_'+strReplaceAll(query," ","_")+'.png><i class="download icon"><i></a>');
      $('#actions_authors').prepend('<div id="download" class="ui right labeled icon button" > <a href="'+chart.getImageURI() +'" download=authors_'+strReplaceAll(query," ","_")+'.png>Download</a><i class="download icon"></i></div>');

    }


    function parse_authors(parsed){
        data3 = [];
        data3.push(['ID','Y','X','Author','Number of publications']);
        var r = []
        var x = 0;
        var documentswithaffiliations=0;
        for (var k in parsed) { // on parcourt le JSON
           if (x<5) { // les cinq premiers resultat avec affichage du label dans bubble chart
             if (k==" , ") {}
                else{
                  x++;
                  var occurence=(parsed[k].length);
              if (parsed.hasOwnProperty(k)) 
                var res = k.split(",");
                data3.push([res[0]+" ("+occurence+")",Math.floor((Math.random() * 180) + 10),Math.floor((Math.random() * 90) + 10),res[0],occurence]); // on push les données dans un array
              }
            }
          else if (x<20) { // les 20 premiers affichers dans le bubble chart
             x++;
            var occurence=(parsed[k].length);
          if (parsed.hasOwnProperty(k)) 
            var res = k.split(",");
            data3.push(["",Math.floor((Math.random() * 180) + 10),Math.floor((Math.random() * 90) + 10),res[0],occurence]); 
          }
          if (k==" , ") {}
          else{
            var occurence=(parsed[k].length);
            if (parsed.hasOwnProperty(k)) 
               var res = k.split(",");
               $( "#authors" ).append('<tr><td>'+res[0]+'</td><td>'+res[1]+'</td><td>'+occurence+'</td></tr>'); //Affichage dans le tableau    
            
          }
            documentswithaffiliations=documentswithaffiliations+occurence;
       }
      $('.authors h5').remove();
      var total = (undefinedaff/(undefinedaff+documentswithaffiliations))*100;
      total = total*100;          
      total= Math.round(total); 
      total= total/100;  
      $('.authors').append('<h5>'+undefinedaff+' records('+total+'%) do not contain data in the field being analyzed.</h5>');
      google.charts.load('current', {'packages':['corechart']}); // on charge les packages de google chart
      google.charts.setOnLoadCallback(drawSeriesChart);

      var table = $('#authors').DataTable( {
          lengthChange: false,
          destroy:true,
          "pageLength": 5, "order": [[ 2, "desc" ]],
          "pagingType": "numbers",
          responsive: true
        } );// pagination du tableau precedemment crée

   
  } 


  function reload_bubble_author(parsed){
        data3 = [];
        data3.push(['ID','Y','X','Author','Number of publications']);
        var r = []
        var x = 0;
        for (var k in parsed) { // on parcourt le JSON
           if (x<5) { // les cinq premiers resultat avec affichage du label dans bubble chart
             if (k==" , ") {}
                else{
                  x++;
                  var occurence=(parsed[k].length);
              if (parsed.hasOwnProperty(k)) 
                var res = k.split(",");
                data3.push([res[0]+" ("+occurence+")",Math.floor((Math.random() * 180) + 10),Math.floor((Math.random() * 90) + 10),res[0],occurence]); // on push les données dans un array
              }
            }
          else if (x<20) { // les 20 premiers affichers dans le bubble chart
             x++;
            var occurence=(parsed[k].length);
          if (parsed.hasOwnProperty(k)) 
            var res = k.split(",");
            data3.push(["",Math.floor((Math.random() * 180) + 10),Math.floor((Math.random() * 90) + 10),res[0],occurence]); 
          }
        }
        google.charts.load('current', {'packages':['corechart']}); // on charge les packages de google chart
      google.charts.setOnLoadCallback(drawSeriesChart);

      }

    $(".istex-search-bar-wrapper :submit").click(function(){
        $('.avert').remove();
        $('.authors h5').remove();
        $('#authors tbody').remove();// remise a zero en cas de recherche simultané
        query=document.getElementsByClassName('istex-search-input')[0].value // recuperation de la valeur de l'input
        $.post("http://localhost/Projet_carto_istex/Backend_Istex_usage/src/index.php/getauthors",
        {
          query: query
        }, // requete ajax sur le backend
        function(data){
            var parsed = JSON.parse(data); // transformation en JSON
             parseauthor=parsed['documents'];
            undefinedaff=parsed['0']['noaff']['noaff'];
            parse_authors(parseauthor);
          
        });

          
    $(".reloadauthor").click(function(){
      reload_bubble_author(parseauthor); // on recreer le bubble chart
       });
    });
});