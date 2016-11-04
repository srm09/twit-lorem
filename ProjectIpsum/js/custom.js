$(function() {
  $('#genLorem').on('click', function(){

    var type = $('input[name=selections]:checked').val();
    var size = $('#count').val();

    if(type === undefined || size === undefined)
      alert('Make the selections')
    else {
      var url = '/'+type+'/mashable/'+size
      $.get(url, (data) => {
        console.log(data)
      });
    }
  })
});
