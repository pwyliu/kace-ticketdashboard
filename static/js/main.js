function genTableHeader(tablename) {
  var header = '';
  header += '<div class="pure-u-1-1 tablecontainer">';
  header += '<h3>' + tablename + '</h3>';
  header += '<table class="pure-table pure-table-horizontal">';
  header += '<thead>';
  header += '<tr>';
  header += '<th>#</th>';
  header += '<th>Owner</th>';
  header += '<th>Status</th>';
  header += '<th>Time Open</th>';
  header += '<th>Category</th>';
  header += '<th>Title</th>';
  header += '<th>Submitter</th>';
  header += '<th>Priority</th>';
  header += '<th>Impact</th>';
  header += '</tr>';
  header += '</thead>';
  header += '<tbody>';
  return header
}

function genTables(data) {

  /* init vars */
  var processed = [];

  /* generate a table per team and insert into dom */
  if (data.teams.length > 0) {
    $.each(data.teams, function(idx, team) {
      var table = genTableHeader(team.name);

      $.each(data.results, function(idx, ticket) {
        if (ticket.OWNER_TEAM == team.name) {
          table += '<tr>';
          table += '<td>' + ticket.ID + '</td>';
          table += '<td>' + ticket.OWNER_NAME + '</td>';
          table += '<td>' + ticket.STATUS + '</td>';
          table += '<td>' + ticket.TIME_OPEN + '</td>';
          table += '<td>' + ticket.CATEGORY + '</td>';
          table += '<td>' + ticket.TITLE + '</td>';
          table += '<td>' + ticket.SUBMITTER_NAME + '</td>';
          table += '<td>' + ticket.IMPACT + '</td>';
          table += '<td>' + ticket.PRIORITY + '</td>';
          table += '</tr>';

          /* mark this ticket as processed */
          processed.push(ticket.ID);
        }
      });
      table += '</tbody>';
      table += '</table>';
      table += '</div>';
      $('#contentbox').append(table);
    });
  }

  /* delete already processed tickets*/
  var leftover = data.results.filter(function(elem) {
    if ($.inArray(elem.ID, processed) == -1){
      return true
    }
  });

  /* create default table for what's left*/
  if (leftover.length > 0) {
    var table = genTableHeader('Default');

    $.each(leftover, function(idx, ticket) {
      table += '<tr>';
      table += '<td>' + ticket.ID + '</td>';
      table += '<td>' + ticket.OWNER_NAME + '</td>';
      table += '<td>' + ticket.STATUS + '</td>';
      table += '<td>' + ticket.TIME_OPEN + '</td>';
      table += '<td>' + ticket.CATEGORY + '</td>';
      table += '<td>' + ticket.TITLE + '</td>';
      table += '<td>' + ticket.SUBMITTER_NAME + '</td>';
      table += '<td>' + ticket.IMPACT + '</td>';
      table += '<td>' + ticket.PRIORITY + '</td>';
      table += '</tr>';
    });
    table += '</tbody>';
    table += '</table>';
    $('#contentbox').append(table);
  }
}

function populateTable() {
  $.ajax({
      url: '/api/tickets',
      dataType: 'json',
      success: function(data) {
        console.log("fetched");
        $("#contentbox").empty();
        genTables(data);
        $(".updated").text(data.timestamp);
      },
      error: function() {
        console.log("error");
      }
  });
  setTimeout(populateTable, 120000);
}

populateTable();