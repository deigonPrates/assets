/*
  funcions principais dos sistema
  controle das tables
*/

$(document).ready(function(){
  $('.money').maskMoney({thousands:'.', decimal:',', allowZero:true, prefix: 'R$'});
});
   $('.dataTables-example').DataTable({
      language: dataTablesPtBr,
      paging: false,
      "lengthChange": false,
      "ordering": false,
      "bFilter": false,
      "bInfo": false,
      "searching": false
   });

     let table = $("#table").DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: {
            url: '{{route('inventory.request.list')}}'
        },
        columns: [
            {name: 'ItemCode', data: 'ItemCode'},
            {name: 'ItemName', data: 'ItemName'},
            {name: 'edit', data: 'ItemCode', render: renderEditButton, orderable: false}
        ],
        lengthMenu: [5, 10, 30],
        language: dataTablesPtBr
    });
    var aux = 0;
    function loadTablePN(){
      var campo = document.getElementById('seachPN').value;
      if(campo != ''){
        var table = $('#tableResult');
        var tr;
        var teste;
        $('#tableResult tbody > tr').remove();
        $.get('/getPNF/' + campo, function (items) {
                for(var i=0;i< items.length; i++){
                     tr = $("<tr id='rowTablePN-" + aux +"'  onclick='setInTable(\""+items[i].CardCode+"\")'>");
                     tr.append($("<td style='width: 10%'>"+items[i].CardCode+"</td>"));
                     tr.append($("<td style='width: 20%'>"+items[i].CardName+"</td>"));
                     tr.append($("<td style='width: 20%'>"+items[i].TaxId0+"</td>"));
                     table.find('tbody').append(tr);
                     aux++;
               }

        });

        if(document.getElementById('resulSearch').style.display == 'block'){
            document.getElementById('resulSearch').style.display = 'none'
        }else{
          document.getElementById('resulSearch').style.display = 'block'
        }
      }else{
        alert('campo busca está em branco!');
      }
    }

   function setInTable(code){
     $('#needs-validation').append($('<input type="hidden" value="' + code + '" data-name="line" name="codPN">'));
       $.get('/getNamePN/' + code, function (items) {
           for(var i=0;i< items.length; i++){
             document.getElementById('parceiroNegocio').value =  items[i].CardName;
           }

       });
       $('#pnModal').modal('hide');
   }
      <?php $aux = true;?>

  function renderEditButton(code) {
        if(valideCode(code, false)){
          return "<center><img src='{{asset('images/add.png')}}' onclick='loadTable(\""+code+"\")'/></center>";
        }else{
          return "<center><img src='{{asset('images/addCinza.png')}}'/></center>";
        }
    }

    var used = new Array ();
    var index = 1;
    function loadTable(code){

      if(valideCode(code, true)){
            var table = $('#requiredTable');

            if(index == 1){
              $('#requiredTable tbody > tr').remove();
            }

           var tr = $("<tr id='rowTable-" + index + "'>");
           tr.append($('<td>'+index+'</td>'));
           tr.find('td').first().append('<input type="hidden" value="' + code + '" data-name="line" name="requiredProducts[' + index + '][codSAP]">');

           $.get('/getProductsSAP/' + code, function (items) {
                   for(var i=0;i< items.length; i++){
                      tr.append($("<td style='width: 8%'>"+items[i].ItemCode+"</td>"));
                      tr.append($("<td style='width: 15%'>"+items[i].ItemName+"</td>"));
                      tr.append($("<td style='width: 5%'><input value='0' onblur='gerarTotal("+ index + ")' id='qtd-"+index+"' type='number' class='form-control ' name='requiredProducts["+ index + "][qtd]'></td>"));
                      tr.append($("<td style='width: 10%'><input  required  onblur='gerarTotal("+ index + ")' id='price-"+index+"' value='"+parseFloat(items[i].AvgPrice)+"'type='text' class='form-control money' name='requiredProducts["+ index + "][preco]' min='1'></td>"));
                      tr.append($("<td style='width: 12%'><input value='0' class='form-control money' id='totalLinha-"+index+"' onblur='gerarPrecoUnitario("+ index + ")' type='text'></td>"));
                      tr.append($("<td style='width: 13%'>"
                                 +"<select class='form-control' data-live-search='true' id='use-"+ index + "' name='requiredProducts["+ index + "][use]' required > <option value=''>Selecione</option> @foreach($use as $keys => $values) <option value='{{$values['code']}}'>{{$values['value']}}</option> @endForeach</select>"
                                 +"</td>"));
                      tr.append($("<td style='width: 13%'>"
                                +"<select class='form-control' data-live-search='true' id='project-"+ index + "' name='requiredProducts["+ index + "][projeto]' required > <option value=''>Selecione</option> @foreach($projeto as $keys => $values) <option value='{{$values['code']}}'>{{$values['value']}}</option> @endForeach</select>"
                                +"</td>"));
                      tr.append($("<td style='width: 12%'>"
                                  +"<select class='form-control' id='role-"+ index + "' name='requiredProducts["+ index + "][role]' required > <option value=''>Selecione</option> @foreach($role as $keys => $values) <option value='{{$values['code']}}'>{{$values['value']}}</option> @endForeach</select>"
                                  +"</td>"));

                     if((document.getElementById('vlFrete').value != 0) && (document.getElementById('vlFrete').value != 'R$0,00')){
                       tr.append($("<td id='itemTable-" + index + "' style='width: 15%'><img src='{{asset('images/remover.png')}}' onclick='removeInArray(\""+items[i].ItemCode+"\");removeLinha(this);' style='font-size: 3%;color: #ec0707;padding-left: 16px;'/></td>"));
                     }else{
                       tr.append($("<td id='itemTable-" + index + "' style='width: 15%'><img src='{{asset('images/addDespesa.png')}}' onclick='gastosExtras(\""+items[i].ItemCode+"\","+ index + ");' style='font-size: 3%;color:  blue; padding-left: 5px;'/><img src='{{asset('images/remover.png')}}' onclick='removeInArray(\""+items[i].ItemCode+"\");removeLinha(this);' style='font-size: 3%;color: #ec0707;padding-left: 16px;'/></td>"));
                      }
                   }
                table.find('tbody').append(tr);
                index++;
            });
        }else{
          alert('Opss!!! o item já foi selecionado anteriormente');
        }
    }
    function gerarTotal(code){
        var qtd = document.getElementById('qtd-'+code).value;
        var preco = document.getElementById('price-'+code).value;
        var total = parseFloat(qtd) * parseFloat(preco.replace(',','.'));
        if(!isNaN(total)){
          document.getElementById('totalLinha-'+code).setAttribute('value', total.toFixed(2));
          sumAllValues();
        }
    }
    function gerarPrecoUnitario(code){
      var totalLinha = document.getElementById('totalLinha-'+code).value;
      var qtd = document.getElementById('qtd-'+code).value;
      var prince = parseFloat(totalLinha.replace(',','.'))/parseFloat(qtd);
      //console.log(prince);
      if(!isNaN(prince)){
          document.getElementById('price-'+code).value = prince;
          sumAllValues();
        }
    }
    function sumAllValues(){
      var total = 0;
      var desconto = 0;
      var x;
      var vf = document.getElementById('vlFrete').value;
      var vd = document.getElementById('vlDesconto').value;
      var i;
      for(i = 1; i < index; i++){
        if(document.getElementById('totalLinha-'+i)){
          x = document.getElementById('totalLinha-'+i).value;
          total = parseFloat(total) + parseFloat(x.replace(',','.'));
        }

      }
      if(vf.substring(0,1) == 'R'){
        vf = vf.substring(2,vf.length);
      }

      total =   vf.replace('.','').replace(',','.');
      desconto = (total/100)*vd;
      total = total - desconto;

      document.getElementById('totalHeader').innerHTML= total.format(2, ",", ".");
      document.getElementById('totalNota').value ='R$ '+ total.format(2, ",", ".");
    }


    function gastosExtras(code, indice){
      if((document.getElementById('vlFrete').value != 0) && (document.getElementById('vlFrete').value != 'R$0,00')){
         alert('Opss: foi definido um valor para o frete anteriormente por esse motivo não pode adicionar novos gastos!');
      }else{
        var form = $('#expensesForm');

        $('#gastosExtras').modal('show').find("button[type=submit]").html('Adicionar');
        form.attr('onsubmit', "setValuesExpenses(\""+code+"\", "+indice+"); return false;");
      }

    }
    function setValuesExpenses(code, indice){
        $('#gastosExtras').modal('hide');
        var vFrete = document.getElementById('vFrete').value;
        var cPagamentos = document.getElementById('cPagamentos').value;
        var form = $('#form');
        form.append('<input type="hidden" value="' + vFrete + '"  name="dividas[' + code + '][vFrete]">');
        form.append('<input type="hidden" value="' + cPagamentos + '"  name="dividas[' + code + '][cPagamentos]">');
        personalizeExpenses(code,indice);
    }
    function personalizeExpenses(code,indice){
      $('#rowTable-'+indice).css({"background-color": "rgba(232, 219, 180, 0.41)"});
      document.getElementById('itemTable-'+indice).innerHTML = "<img src='{{asset('images/expenses.png')}}' onclick='gastosExtras(\""+code+"\","+ index + ");' style=' width:37%;font-size: 3%;color:  blue; padding-left: 5px;'/><img src='{{asset('images/remover.png')}}' onclick='removeInArray(\""+code+"\");removeLinha(this);' style='font-size: 3%;color: #ec0707;padding-left: 16px;'/>";
    }
    function removeLinha(elemento){
      var tr = $(elemento).closest('tr');
       tr.fadeOut(400, function(){
         tr.remove();
       });
       $("#composicao-" + elemento).remove();
    }
    function valideCode(code, mark=true){
        if(used.indexOf(code) == '-1'){
          if(mark){
            used.push(code);
          }
          return true;
        }else{
         return false;
        }
    }
    function removeInArray(code){
      var aux = used.indexOf(code);
      if(aux != -1){
        used.splice(aux,1);
      }
    }

    function setUseFull(){
      var val = document.getElementById('useGlobal').value;
      var i;
      console.log(val);
      for(i = 1; i <= index; i++){
          if(document.getElementById('use-'+i)){
            document.getElementById('use-'+i).value = val;
          }
      }
   }
  function setProjecFull(){
       var val = document.getElementById('projectGlobal').value;
       var i;
       for(i = 1; i <= index; i++){
           if(document.getElementById('project-'+i)){
             document.getElementById('project-'+i).value = val;
           }
       }
   }
  function setRoleFull(){
    var val = document.getElementById('roleGlobal').value;
    var i;
    console.log(val);
    for(i = 1; i <= index; i++){
        if(document.getElementById('role-'+i)){
          document.getElementById('role-'+i).value = val;
        }
    }
  }
