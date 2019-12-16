"use strict";

const TextInput = ({ name, value, onChange }) => {
  return (
    <p>
      <label htmlFor={name}>{name}</label>
      <input 
        name={name}
        type='text' 
        value={value}
        onChange={onChange} />
    </p>
  );
};

const Checkbox = ({ name, value,checked, onChange }) => {
  return (
    <p>
      <label htmlFor={name}>{name}</label>
      <input 
        name={name}
        type='checkbox' 
        value={value}
        checked={checked}
        onChange={onChange} />
    </p>
  );
};

const Radio = ({ name, value, onChange }) => {
  return (
    <p>
      <label htmlFor={name}>{name}</label>
      <input 
        name={name}
        type='radio' 
        value={value}
        onChange={onChange} />
    </p>
  );
};

const Osio = ({ nimi, kentat, onChange }) => {
  
   const createField = (field, index) => {
    switch (field.type) {
      case "text":
        return <TextInput key={index.toString()} name={field.name} value={field.value} onChange={onChange}/>;
      case "checkbox-group":
        return (
          <div>
              {field.options.map((option, index) => ( 
                <Checkbox key={index.toString()} name={option.label} value={option.value} checked={option.checked} onChange={onChange}/>
              ))}
          </div>
          );
      case "radio":
        console.log("This field should be type radio: ", field.type);
        return <Radio key={index.toString()} name={field.name} value={field.value} onChange={onChange}/>;
      default:
        console.log("Tämä on default arvo kentälle");
        return <div key={index.toString()}>This is empty</div>;
    }
  };

  let fields = [];
  kentat.forEach(function(kentta, index){
    fields.push(createField(kentta, index));
  });

  return (
    <fieldset>
      <legend>{nimi}</legend>
        {fields}
    </fieldset>
  );
};


class LisaaJoukkue extends React.Component {
  constructor(props) {
    super(props);
  }

  handleInputs = event => {
    this.props.onInputChange(event);
  };

  render() {
    return (
      <div className="form">
        <h2>Lisää joukkue</h2>
        <form>
          {this.props.form.sections.map((section, index) => (
            <Osio
              key={index.toString()}
              nimi={section.name}
              kentat={section.fields}
              onChange={this.handleInputs}
            />
          ))}
        </form>
        <button>Lisää uusi joukkue</button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    // Käytetään samaa tietorakennetta kuin viikkotehtävässä 1, mutta vain jäärogainingin joukkueita
    // tehdään tämän komponentin tilaan kopio jäärogainingin tiedoista. Tee tehtävässä vaaditut lisäykset ja muutokset tämän komponentin tilaan
    // Tämä on tehtävä näin, että saadaan oikeasti aikaan kopio eikä vain viittausta samaan tietorakenteeseen. Objekteja ja taulukoita ei voida kopioida vain sijoitusoperaattorilla
    // päivitettäessä React-komponentin tilaa on aina vanha tila kopioitava uudeksi tällä tavalla
    // kts. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
    let kilpailu = new Object();
    kilpailu.nimi = data[2].nimi;
    kilpailu.loppuaika = data[2].loppuaika;
    kilpailu.alkuaika = data[2].alkuaika;
    kilpailu.kesto = data[2].kesto;
    kilpailu.leimaustapa = Array.from(data[2].leimaustapa);
    kilpailu.rastit = Array.from(data[2].rastit);
    function kopioi_joukkue(j) {
      let uusij = {};
      uusij.nimi = j.nimi;
      uusij.id = j.id;

      uusij["jasenet"] = Array.from(j["jasenet"]);
      uusij["rastit"] = Array.from(j["rastit"]);
      uusij["leimaustapa"] = Array.from(j["leimaustapa"]);
      return uusij;
    }
    function kopioi_sarja(s) {
      let uusis = {};
      uusis.nimi = s.nimi;
      uusis.alkuaika = s.alkuaika;
      uusis.loppuaika = s.loppuaika;
      uusis.kesto = s.kesto;
      uusis.joukkueet = Array.from(s.joukkueet, kopioi_joukkue);
      return uusis;
    }

    kilpailu.sarjat = Array.from(data[2].sarjat, kopioi_sarja);

    // tuhotaan vielä alkuperäisestä tietorakenteesta rastit ja joukkueet niin
    // varmistuuu, että kopiointi on onnistunut
    for (let i in data[2].rastit) {
      delete data[2].rastit[i];
    }
    for (let sarja of data[2].sarjat) {
      for (let i in sarja.joukkueet) {
        delete sarja.joukkueet[i];
      }
    }

    // muodostetaan taulukko kaikista kilpailun joukkueista ja järjestetään ne nimen mukaan aakkosjärjestykseen
    let joukkueet = [];
    kilpailu.sarjat.forEach(function(sarja) {
      joukkueet = joukkueet.concat(sarja.joukkueet);
    });
    joukkueet.sort((a, b) =>
      a.nimi.toLowerCase() > b.nimi.toLowerCase() ? 1 : -1
    );

    //        console.log( kilpailu );
    //        console.log(data);
    this.state = {
      //setting initial state of the component, setState does not work as the component is not rendered yet
      kilpailu: kilpailu,
      joukkueet: joukkueet,

      form: {
        sections: [
          {
            name: "Joukkueen tiedot",
            fields: [
              {
                name: "Nimi",
                type: "text",
              },
              {
                name: "Leimaustapa",
                type: "checkbox-group",
                options: [
                  {
                    label: "testi",
                    value: "testi",
                    checked: false
                  },
                  {
                    label: "testi",
                    value: "testi",
                    checked: false
                  }
                ]
              },
              {
                name: "Sarja",
                type: "radio",
                options: [
                  {
                    label: "",
                    value: "",
                    selected: false
                  }
                ]
              }
            ]
          },
          {
            name: "Jäsenet",
            fields: [
              {
                name: "Jäsen 1",
                type: "text",
              },
              {
                name: "Jäsen 2",
                type: "text",
              },
              {
                name: "Jäsen 3",
                type: "text",
              },
              {
                name: "Jäsen 4",
                type: "text",
              },
              {
                name: "Jäsen 5",
                type: "text",
              }
            ]
          }
        ]
      }
    };
    //this.setState({"kilpailu": kilpailu }); //cannot use this yet as the component has not been rendered
    return;
  }

  handleInputChange = event => {
    let fieldName = event.target.name;
    this.setState({
      [fieldName]: event.target.value
    });
    console.log(this.state);
  };

  render() {
    return (
      <div className="app">
        <LisaaJoukkue
          form={this.state.form}
          onInputChange={this.handleInputChange}
        />
        <ListaaJoukkueet list={this.state.joukkueet} />
      </div>
    );
  }
}


class ListaaJoukkueet extends React.Component {
  render() {
    return (
      <div className="list">
        <h3>Joukkueet</h3>
        <ul>
          {this.props.list.map((item, index) => (
            <li key={index}>{item.nimi}</li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
