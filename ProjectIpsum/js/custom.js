$(function() {
  $.get('/handles', (data) => {
    for(var i=0; i<data.length; ++i)
      $('#handleSelect').append('<option>'+data[i]+'</option>')
  })

  $('#genLorem').on('click', function(){

    var type = $('input[name=selections]:checked').val();
    var size = $('#count').val();
    var handle = $('#handleSelect').find(":selected").text();

    if(type === undefined || size === undefined)
      alert('Make the selections')
    else {
      var url = '/'+type+'/'+handle+'/'+size
      $.get(url, (data) => {
        console.log(data)
      });
    }
  })
});
