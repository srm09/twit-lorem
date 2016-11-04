$(function() {

  $('#myModal').on('show.bs.modal', function () {
    $('.modal .modal-body').css('overflow-y', 'auto');
    $('.modal .modal-body').css('max-height', $(window).height() * 0.7);
  });

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
        var para_html = ''
        $('#myModalLabel').empty()
        $('#myModalLabel').append('@'+data.handle+ ' says: ')

        for(var i=0; i<data.paras.length; ++i) para_html += data.paras[i]
        $('#loremIpsumBody').empty()
        $('#loremIpsumBody').append(para_html)
        console.log(data)
        $('#modalLauncher').click()
      });
    }
  })
});
