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

function genTableRow(table, servername, ticketdata){
  table += '<tr>';
  table += '<td><a target="KACE" href="https://' + servername + '/adminui/ticket.php?ID=' + ticketdata.ID + '">' + ticketdata.ID + '</a></td>';
  table += '<td>' + ticketdata.OWNER_NAME + '</td>';
  table += '<td>' + ticketdata.STATUS + '</td>';
  table += '<td>' + ticketdata.TIME_OPEN + '</td>';
  table += '<td>' + ticketdata.CATEGORY + '</td>';
  table += '<td>' + ticketdata.TITLE + '</td>';
  table += '<td>' + ticketdata.SUBMITTER_NAME + '</td>';
  table += '<td>' + ticketdata.IMPACT + '</td>';
  table += '<td>' + ticketdata.PRIORITY + '</td>';
  table += '</tr>';
  return table
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
          table = genTableRow(table, data.server, ticket);

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
      table = genTableRow(table, data.server, ticket);
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
        $("#contentbox").empty();
        genTables(data);
        var dumbKACEUrl = '/adminui/ticket_list.php?FINDFIELDS%5BWFIELD1%5D=HD_STATUS.NAME&FINDFIELDS%5BEXP_SELECT1%5D=CONTAINS&FINDFIELDS%5BINPUT1%5D=Open&FINDFIELDS%5BUNION_SELECT2%5D=OR&FINDFIELDS%5BWFIELD2%5D=HD_STATUS.NAME&FINDFIELDS%5BEXP_SELECT2%5D=CONTAINS&FINDFIELDS%5BINPUT2%5D=On+Hold&FINDFIELDS%5BUNION_SELECT3%5D=OR&FINDFIELDS%5BWFIELD3%5D=HD_STATUS.NAME&FINDFIELDS%5BEXP_SELECT3%5D=CONTAINS&FINDFIELDS%5BINPUT3%5D=In+Progress&FINDFIELDS%5BUNION_SELECT4%5D=0&ASSOCIATED=&ID_ASSOC_TO=0&aq_search=Search'
        $(".updated").html(data.timestamp + ' | <a target="KACE" href="https://' + data.server + dumbKACEUrl + '">' + data.server + '</a>');
      },
      error: function() {
        console.log("error");
      }
  });
  setTimeout(populateTable, 120000);
}

populateTable();