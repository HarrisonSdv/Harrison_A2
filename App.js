import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CheckBox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";

const App = () => {
  // Logic
  const [SAddress, setSAddress] = useState("");
  const [DAddress, setDAddress] = useState("");
  const [PType, setPType] = useState("");
  const [PWeight, setPWeight] = useState("");
  const [PRate, setPRate] = useState("");
  const [Addon, setAddon] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const PACKAGE = "Package"
  const LETTER = "Letter/Document"

  const MAXLETTER = 1.1;
  const MAXPACKAGE = 44;

  const NULLRATE = [0,0,0]
  const [CURRENTRATE, setCURRENTRATE] = useState(NULLRATE)
  const PACKAGERATE = [12.99, 18.99, 24.99];
  const LETTERRATE = [4.99, 9.99, 14.99];

  const Check = () => {
    if (SAddress == ""){
      Alert.alert("Please enter a Sending Address")
      return false;
    }
    if (DAddress == ""){
      Alert.alert("Please enter a Destination Address")
      return false;
    }
    if (PType == PACKAGE) {
      if (PWeight > MAXPACKAGE || PWeight <= 0) {
        Alert.alert("Parcel Weight is not a valid value");
        return false;
      }
    }
    else if (PType==LETTER){
      if (PWeight > MAXLETTER || PWeight <= 0) {
        Alert.alert("Parcel Weight is not a valid value");
        return false;
      }
    } 
    else if (PType == null) {
      Alert.alert("Please select Parcel Type");
      return false;
    } 
    return true
  }

  const setType = (itemValue) => {
    setPType(itemValue);
    setPRate(0);
  }

  const setRate = () => {
    if (PType == PACKAGE) {
      setCURRENTRATE(PACKAGERATE);
    } else if (PType == LETTER) {
      setCURRENTRATE(LETTERRATE)
    } else {
      setCURRENTRATE(NULLRATE)
    }
  }

  const handleRateCalculate = () => {
    if(Check()){
      setModalData({
        SAddress: SAddress,
        DAddress: DAddress,
        PType: PType,
        PWeight: PWeight,
        PRate: (PRate == 0) ? CURRENTRATE[0] : PRate,
        Addon: Addon ? 2 : 0,
        // SubTotal: this.PRate + this.Addon,
        // Tax: this.SubTotal * 13 / 100,
        // Total: this.SubTotal + this.Tax,
      });
      setIsModalVisible(() => !isModalVisible);
    }
  };

  // UI or View
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          backgroundColor: "#e74c3c",
          color: "white",
          width: "100%",
          height: 40,
          textAlign: "center",
        }}
      >
        Courier Rate Calculator
      </Text>

      <Text style={styles.Text}>
        Sending Address
      </Text>

      <TextInput
        style={styles.inputStyle}
        value={SAddress}
        placeholder="Enter Sending Address"
        onChangeText={setSAddress}
        keyboardType="default"
        autoCorrect={false}
      />

      <Text style={styles.Text}>
        Destination Address
      </Text>

      <TextInput
        style={styles.inputStyle}
        value={DAddress}
        onChangeText={setDAddress}
        placeholder="Enter Destination Address"
        keyboardType="default"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.Text}>
        Parcel Type
      </Text>

      <Picker
        style={styles.dropDownStyle}
        selectedValue={PType}
        onValueChange={(itemValue) => setType(itemValue)}
        onBlur={() => setRate()}
      >
        <Picker.Item label="Select Parcel Type" value = {null} />
        <Picker.Item label="Package (<=44 lbs)" value = {PACKAGE} />
        <Picker.Item label="Letter/Document (<=1.1 lbs)" value={LETTER} />
      </Picker>

      <Text style={styles.Text}>
        Parcel Weight(lbs)
      </Text>

      <TextInput
        style={styles.inputStyle}
        value={PWeight}
        onChangeText={setPWeight}
        placeholder="Enter Weight"
        keyboardType="default"
      />

      <Picker
        style={styles.dropDownStyle}
        selectedValue={PRate}
        onValueChange={(itemValue) => setPRate(itemValue)}
      >
        <Picker.Item label={"Standard ($"+CURRENTRATE[0]+")"} value={CURRENTRATE[0]}/>
        <Picker.Item label={"Xpress Post ($"+CURRENTRATE[1]+")"} value={CURRENTRATE[1]}/>
        <Picker.Item label={"Priority Post ($"+CURRENTRATE[2]+")"} value={CURRENTRATE[2]}/>
      </Picker>

      <View style={styles.checkBoxContainer}>
        <Text style={styles.Text}>Signature Option (+$2)</Text>
        <CheckBox
          value={Addon}
          onValueChange={(value) => setAddon(value)}
        />
        </View>

      <TouchableOpacity style={styles.buttonStyle} onPress={handleRateCalculate}>
        <Text style={styles.buttonText}>Check Rate</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.container}>
        <Text style={styles.Text}>Sending Address: {modalData.SAddress}</Text>
        <Text style={styles.Text}>Destination Address: {modalData.DAddress}</Text>
        <Text style={styles.Text}>Parcel Type: {modalData.PType}</Text>
        <Text style={styles.Text}>Parcel Weight: {modalData.PWeight}lbs</Text>
        <Text style={styles.Text}>Parcel Rate: ${modalData.PRate}</Text>
        <Text style={styles.Text}>Signature Addon: ${modalData.Addon}</Text>
        <Text style={styles.Text}>SubTotal: ${modalData.PRate + modalData.Addon}</Text>
        <Text style={styles.Text}>Tax: ${((modalData.PRate + modalData.Addon) * 13 / 100).toFixed(2)}</Text>
        <Text style={styles.Text}>Total: ${((modalData.PRate + modalData.Addon) * 113 / 100).toFixed(2)}</Text>

          <TouchableOpacity
            style={[styles.buttonStyle, { marginTop: "auto" }]}
            onPress={() => setIsModalVisible(!isModalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* <View style={{ width: "100%", padding: 10 }}>
        <Text style={styles.Text}>Sending Address: {SAddress}</Text>
        <Text style={styles.Text}>Destination Address: {DAddress}</Text>
        <Text style={styles.Text}>Parcel Type: {PType}</Text>
        <Text style={styles.Text}>Parcel Weight: {PWeight}</Text>
        <Text style={styles.Text}>Parcel Rate: {PRate}</Text>
      </View> */}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 60,
  },
  inputStyle: {
    fontSize: 20,
    borderColor: "#e74c3c",
    borderWidth: 2,
    padding: 5,
    height: 50,
    width: "95%",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonStyle: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: 45,
    borderRadius: 5,
    backgroundColor: "rgba(231, 76, 60,0.8)",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  Text: {
    fontSize: 20,
    fontWeight: "400",
    marginTop: 5,
  },
  dropDownStyle: {
    width: "95%",
    borderColor: "#e74c3c",
    borderWidth: 2,
    borderRadius: 5,
  },
    checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 5,
  },
});

export default App;
