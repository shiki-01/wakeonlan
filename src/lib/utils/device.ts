import { toast } from 'svelte-sonner';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';
import { checkDeviceStatus } from '$lib/utils/api';
import { devices } from '$lib/store';
import { setUserInfo } from '$lib/utils/auth';
import type { UserInfo } from 'firebase/auth';
import CryptoJS from 'crypto-js';
import { lang as Lang } from '$lib/store';
import langs from '$lib/utils/langs';

let userInfo: UserInfo | null = null;

let deviceName = '';
let os = '';
let ipAddress = '';
let deviceIp = '';
let mac = '';
let port = '';

let addName = '';
let addOs = '';
let addIp = '';
let addDeviceIp = '';
let addMac = '';
let addPort = '';

function setEdit(name: string, osS: string, ip: string, dip: string, macAddress: string, portNumber: string) {
  deviceName = name;
  os = osS;
  ipAddress = ip;
  deviceIp = dip;
  mac = macAddress;
  port = portNumber;
}

function addDeviceEdit(name: string, osA: string, ip: string, dip: string, macAddress: string, portNumber: string) {
  addName = name;
  addOs = osA;
  addIp = ip;
  addDeviceIp = dip;
  addMac = macAddress;
  addPort = portNumber;
}

function encryptField(field: string, key: string): string {
  return CryptoJS.AES.encrypt(field, key).toString();
}

function decryptField(ciphertext: string | undefined, key: string): string {
  if (!ciphertext) {
    return '';
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function getDevices() {
  userInfo = setUserInfo();
  let lang: 'en' | 'ja' = 'en';
  Lang.subscribe((value) => {
    lang = value;
  });
  if (!userInfo) {
    toast.error(langs.toast.device.get.login[lang]);
    return;
  }
  const key = userInfo.uid;
  const userDevicesRef = collection(db, 'users', userInfo.uid, 'devices');
  const querySnapshot = await getDocs(userDevicesRef);
  const devicesWithStatus = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const encryptedData = doc.data();
      const deviceData = {
        name: decryptField(encryptedData.name, key),
        os: encryptedData.os,
        ip: decryptField(encryptedData.ip, key),
        deviceIp: decryptField(encryptedData.deviceIp, key),
        mac: decryptField(encryptedData.mac, key),
        port: decryptField(encryptedData.port, key),
        isActive: false
      };
      deviceData.isActive = await checkDeviceStatus(
        deviceData.ip,
        deviceData.port,
        deviceData.deviceIp
      );
      return {
        ...deviceData,
        id: doc.id
      };
    })
  );
  devices.set(devicesWithStatus);
}

async function addDevice() {
  userInfo = setUserInfo();
  let lang: 'en' | 'ja' = 'en';
  Lang.subscribe((value) => {
    lang = value;
  });
  if (!userInfo) {
    toast.error(langs.toast.device.add.login[lang]);
    return;
  }
  if (addName === '' || addOs === '' || addDeviceIp === '' || addMac === '' || addPort === '') {
    toast.error(langs.toast.device.add.error[lang]);
    return;
  }
  const key = userInfo.uid;
  const newDevice = {
    name: encryptField(addName, key),
    os: addOs,
    ip: encryptField(addIp, key),
    deviceIp: encryptField(addDeviceIp, key),
    mac: encryptField(addMac, key),
    port: encryptField(addPort, key)
  };
  const userDevicesRef = collection(db, 'users', userInfo.uid, 'devices');
  await addDoc(userDevicesRef, newDevice);
  addName = '';
  addOs = '';
  addIp = '';
  addDeviceIp = '';
  addMac = '';
  addPort = '';
  await getDevices();
  toast.success(langs.toast.device.add.success[lang]);
}

async function editDevice(editId: string) {
  userInfo = setUserInfo();
  let lang: 'en' | 'ja' = 'en';
  Lang.subscribe((value) => {
    lang = value;
  });
  if (!userInfo) {
    toast.error(langs.toast.device.add.login[lang]);
    return;
  }
  if (deviceName === '' || os === '' || deviceIp === '' || mac === '' || port === '') {
    toast.error(langs.toast.device.add.error[lang]);
    return;
  }
  const key = userInfo.uid;
  const updatedDevice = {
    name: encryptField(deviceName, key),
    os: os,
    ip: encryptField(ipAddress, key),
    deviceIp: encryptField(deviceIp, key),
    mac: encryptField(mac, key),
    port: encryptField(port, key)
  };
  const deviceRef = doc(db, 'users', userInfo.uid, 'devices', editId);
  await updateDoc(deviceRef, updatedDevice);
  await getDevices();
  toast.success(langs.toast.device.edit.success[lang]);
}

async function deleteDevice(editId: string) {
  userInfo = setUserInfo();
  let lang: 'en' | 'ja' = 'en';
  Lang.subscribe((value) => {
    lang = value;
  });
  if (!userInfo) {
    toast.error(langs.toast.device.delete.login[lang]);
    return;
  }
  const deviceRef = doc(db, 'users', userInfo.uid, 'devices', editId);
  await deleteDoc(deviceRef);
  await getDevices();
  toast.success(langs.toast.device.delete.success[lang]);
}

export { setEdit, addDeviceEdit, addDevice, editDevice, deleteDevice, getDevices };