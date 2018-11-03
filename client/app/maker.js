var token;

const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({
        width: 'hide'
    }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val == '') {
        handleError('All fields are required');
        return false;
    }
   
    

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function (param) {
        loadDomosFromServer();
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name"> Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            
            <label htmlFor="age"> Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="domo age" />
            <label htmlFor="level"> Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="domo level" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};


function levelUp (id) {
    updateLevel(id);
    loadDomosFromServer();
}


const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo"> No Domos yet </h3>
            </div>
        );
    }


   

    const domoNodes = props.domos.map(function (domo) {
        

        return (
            <div key={domo._id} className='domo'>
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoLevel" id="level"> Level: {domo.level} </h3>
                <button className="levelUp" onClick={() => levelUp(domo._id) }>Level Up</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};








const loadDomosFromServer = () =>{
    sendAjax('GET', '/getDomos',  null, (data) => {
        //console.log(data.domos);
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
        //searchDomos();
    });

};


const updateLevel = (domoID) => {

    var domo = {
        _id: domoID,
        _csrf: token,
    }

    //console.log(domo);
    sendAjax('POST', '/updateLevel', $.param(domo), (data)=>{
        //console.log(data);
        loadDomosFromServer();

    });
};

const searchDomos = (domoID) => {

    var domo = {
        _id: domoID,
        _csrf: token,
    }

    //console.log(domo);
    sendAjax('GET', '/searchDomos', $.param(domo), (data)=>{
        //console.log(data);
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        token = result.csrfToken;
        setup(result.csrfToken);
    });
};


$(document).ready(function(){
    getToken();
});