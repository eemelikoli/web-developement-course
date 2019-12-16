"use strict";

const initialForm = {
  nimi: "",
  leimaustapa: [],
  sarja: "2h",
  jasen_1: "",
  jasen_2: "",
  jasen_3: "",
  jasen_4: "",
  jasen_5: "",
  nameError: "",
  memberError: ""
};


const TextInput = ({ name, label, value, onChange }) => {
  return (
    <p>
      <label htmlFor={name}>{label}</label>
      <input name={name} type="text" value={value} onChange={onChange} />
    </p>
  );
};


const Checkbox = ({ name, label, value, checked, onChange }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input
        name={name}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};


const Radio = ({ name, label, value, checked, onChange }) => {
  return (
    <p>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </p>
  );
};


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


class LisaaJoukkue extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form">
        <h2>Lisää joukkue</h2>
        <form onSubmit={this.props.submitHandler}>
          <fieldset>
            <legend>Joukkueen tiedot</legend>
            <TextInput
              name="nimi"
              label="Nimi"
              value={this.props.form.nimi}
              onChange={this.props.inputHandler}
            />
            <div className="errorMsg">{this.props.form.nameError}</div>
            <div className="checkbox-group">
              <label>Leimaustapa</label>
              <Checkbox
                name="GPS"
                label="GPS"
                value="GPS"
                checked={this.props.form.leimaustapa.indexOf("GPS") !== -1}
                onChange={this.props.checkboxHandler}
              />
              <Checkbox
                name="NFC"
                label="NFC"
                value="NFC"
                checked={this.props.form.leimaustapa.indexOf("NFC") !== -1}
                onChange={this.props.checkboxHandler}
              />
              <Checkbox
                name="QR"
                label="QR"
                value="QR"
                checked={this.props.form.leimaustapa.indexOf("QR") !== -1}
                onChange={this.props.checkboxHandler}
              />
              <Checkbox
                name="Lomake"
                label="Lomake"
                value="Lomake"
                checked={this.props.form.leimaustapa.indexOf("Lomake") !== -1}
                onChange={this.props.checkboxHandler}
              />
            </div>
            <div className="radiobutton-group">
              <Radio
                name="sarja"
                label="2h"
                value="2h"
                checked={this.props.form.sarja === "2h"}
                onChange={this.props.inputHandler}
              />
              <Radio
                name="sarja"
                label="4h"
                value="4h"
                checked={this.props.form.sarja === "4h"}
                onChange={this.props.inputHandler}
              />
              <Radio
                name="sarja"
                label="8h"
                value="8h"
                checked={this.props.form.sarja === "8h"}
                onChange={this.props.inputHandler}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Jäsenet</legend>
            <TextInput
              name="jasen_1"
              label="Jasen 1"
              value={this.props.form.jasen_1}
              onChange={this.props.inputHandler}
              required={true}
            />
            <div className="errorMsg">{this.props.form.memberError}</div>
            <TextInput
              name="jasen_2"
              label="Jasen 2"
              value={this.props.form.jasen_2}
              onChange={this.props.inputHandler}
              required={true}
            />
            <div className="errorMsg">{this.props.form.memberError}</div>
            <TextInput
              name="jasen_3"
              label="Jasen 3"
              value={this.props.form.jasen_3}
              onChange={this.props.inputHandler}
            />
            <TextInput
              name="jasen_4"
              label="Jasen 4"
              value={this.props.form.jasen_4}
              onChange={this.props.inputHandler}
            />
            <TextInput
              name="jasen_5"
              label="Jasen 5"
              value={this.props.form.jasen_5}
              onChange={this.props.inputHandler}
            />
          </fieldset>
          <button type="submit">Lisää uusi joukkue</button>
        </form>
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

    // console.log( kilpailu );
    // console.log(data);
    //setting initial state of the component, setState does not work as the component is not rendered yet
    this.state = {
      kilpailu: kilpailu,
      form: initialForm
    };
    //this.setState({"kilpailu": kilpailu }); //cannot use this yet as the component has not been rendered
    return;
  }


  /**
   * Generating list of teams
   */ 
  generateTeamList = () => {
    // generating a list of all the teams in the competition
    let joukkueet = [];
    this.state.kilpailu.sarjat.forEach(function(sarja) {
      joukkueet = joukkueet.concat(sarja.joukkueet);
    });
    return joukkueet;
  };


  /**
   * Does validation for the given team name
   */
  validateName = () => {
    let trimmedValue = this.state.form.nimi.trim();
    if (trimmedValue.length < 2) {
      return "Nimen täytyy olla vähintään kaksi merkkiä pitkä.";
    }
    if (
      this.state.joukkueet
        .map(joukkue => joukkue.nimi.trim().toLowerCase())
        .indexOf(trimmedValue.toLowerCase()) > -1
    ) {
      return "Saman niminen joukkue on jo olemassa.";
    }
    return "";
  };


  /**
   * Does live validation for the form
   */
  liveValidate = () => {
    let nameError = "",
      memberError = "";

    nameError = this.validateName();
    if (this.state.form.jasen_1 == "" || this.state.form.jasen_2 == "") {
      memberError = "Kentissä Jäsen 1 ja Jäsen 2 täytyy olla jokin arvo";
    }

    this.setState(prevState => {
      return {
        form: {
          ...prevState.form,
          nameError: nameError,
          memberError: memberError
        }
      };
    });
  };


  /**
   * Does the final submit validation for the form
   */
  validateSubmit = () => {
    let nameError = "",
      memberError = "";

    nameError = this.validateName();
    if (this.state.form.jasen_1 == "" || this.state.form.jasen_2 == "") {
      memberError = "Kentissä Jäsen 1 ja Jäsen 2 täytyy olla jokin arvo";
    }

    this.setState(prevState => {
      return {
        form: {
          ...prevState.form,
          nameError: nameError,
          memberError: memberError
        }
      };
    });

    if (nameError || memberError) {
      return false;
    }
    return true;
  };


  /**
   * Randomly generates an unique id for a t eam
   */
  generateID = joukkueet => {
    let id = 0;
    while (id === 0 || joukkueet.some(joukkue => joukkue.id === id)) {
      id = Math.floor(Math.random() * 1000000000000000);
    }
    return id;
  };


  /**
   * Handles all text inputs and radiobutton updates
   */
  inputHandler = event => {
    let fieldName = event.target.name;
    let value = event.target.value;
    this.setState(prevState => {
      return {
        form: {
          ...prevState.form,
          [fieldName]: value
        }
      };
    }, this.liveValidate);
  };


  /**
   * Handles checkbox input updates
   */
  checkboxHandler = event => {
    let isChecked = event.target.checked;
    let value = event.target.value;

    this.setState(prevState => {
      let leimaustapa = isChecked
        ? (leimaustapa = prevState.form.leimaustapa.concat(value))
        : (leimaustapa = prevState.form.leimaustapa.filter(
            type => type !== value
          ));
      return {
        form: {
          ...prevState.form,
          leimaustapa
        }
      };
    });
  };


  /**
   * Handles form submit event
   */
  submitHandler = event => {
    event.preventDefault();

    if (this.validateSubmit()) {
      let sarja = this.state.form.sarja;
      var idx = this.state.kilpailu.sarjat.findIndex(
        element => element.nimi === sarja
      );
      //if we don't find the selected series then do nothing
      if (idx === -1) {
        return;
      }

      //due to time constraints I'll use hardcoded way to generate the members array
      let jasenet = [];
      for (let i = 1; i <= 5; i++) {
        let value = this.state.form["jasen_" + i];
        if (value === "") {
          continue;
        }
        jasenet.push(value);
      }

      // generate the team object
      let joukkue = {
        id: this.generateID(this.state.joukkueet),
        jasenet: jasenet,
        leimaustapa: this.state.form.leimaustapa,
        nimi: this.state.form.nimi,
        rastit: []
      };

      // updating the state with
      this.setState(prevState => {
        let kilpailu = { ...prevState.kilpailu };
        kilpailu.sarjat[idx].joukkueet.push(joukkue);
        return {
          kilpailu: kilpailu,
          form: initialForm
        };
      });
    }
  };

/**
 * Function sorts teams based on name
 */
  sortTeams = () => {
    this.state.joukkueet.sort((a, b) =>
      a.nimi.toLowerCase() > b.nimi.toLowerCase() ? 1 : -1
    );
  };

  render() {
    this.sortTeams();
    return (
      <div className="app">
        <LisaaJoukkue
          form={this.state.form}
          inputHandler={this.inputHandler}
          checkboxHandler={this.checkboxHandler}
          submitHandler={this.submitHandler}
        />
        <ListaaJoukkueet list={this.generateTeamList} />
      </div>
    );
  }
}



ReactDOM.render(<App />, document.getElementById("root"));
