var socket;

socket=io.connect('http://localhost:3000');
socket.on('onLoad',loadpage)
function loadpage(json){

    for (i in json){
        console.log(json[i].id+': '+json[i].status)
        var element='#'+json[i].id;
        if(json[i].status==1){
            $(element).addClass('on');
            $(element).removeClass('off');
            $(element+'>i').addClass('bright');
            $(element).attr('status',json[i].status);
        }
        else{
            $(element).addClass('off');
            $(element).removeClass('on');
            $(element+'>i').removeClass('bright');
            $(element).attr('status',json[i].status);
        }
    }
}
socket.on('click',doThings)
function doThings(data){

    console.log(data[0].id+' '+data[0].status)
    var element='#'+data[0].id;
    var status=data[0].status;
    var count=5;
    var timer=setInterval(function(){
        $(element).unbind('click');
        $(element+' .count').removeClass('hide');
        $(element+' .count>p').html(count);
        if(count==0){
            $(element+' .count').addClass('hide');
            $(element).bind('click',function(){

                var status=$(this).attr('status');
                var id=$(this).attr('id');
                if (status==0){
                    status=1;
                    $(this).attr('status',status);
                }
                else{
                    status=0;
                    $(this).attr('status',status);
                }
                var arr=[];
                var idstatus=[];
                arr.push($('.lmp'));
                var len=arr[0].length;

                var elid=$(this).attr('id');
                var elstatus=$(this).attr('status');

                var obj={
                    "id": elid,
                    "status": elstatus
                }
                idstatus.push(obj)
                socket.emit('click',idstatus);
            });
            clearInterval(timer);
        }
        count--;

    },1000);


    if(status==1){
        $(element).addClass('on');
        $(element).removeClass('off');
        $(element+'>i').addClass('bright');
        $(element).attr('status',status);
    }
    else{
        $(element).addClass('off');
        $(element).removeClass('on');
        $(element+'>i').removeClass('bright');
        $(element).attr('status',status);
    }






}
$('.lmp').on('click',function(){
    $(this).unbind('click');
    var status=$(this).attr('status');
    var id=$(this).attr('id');
    if (status==0){
        status=1;
        $(this).attr('status',status);
    }
    else{
        status=0;
        $(this).attr('status',status);
    }
    var arr=[];
    var idstatus=[];
    arr.push($('.lmp'));
    var len=arr[0].length;

    var elid=$(this).attr('id');
    var elstatus=$(this).attr('status');

    var obj={
        "id": elid,
        "status": elstatus
    }
    idstatus.push(obj)
    socket.emit('click',idstatus);



});

$('#resetbtn').click(function(){
    window.location.href="/reset"
})
//***************************************\\
/*

for(var i = 0 ; i<len ; i++){
 var elemid=arr[0][i]['id'];
 var elemstatus=arr[0][i]['attributes'][2].value;


 var obj={
 "id": elemid,
 "status": elemstatus
 };

 idstatus.push(obj)


 }
 for(i in idstatus){
 if(idstatus[i].id ==$(this).attr('id')){
 console.log(idstatus[i])
 }
 }*/