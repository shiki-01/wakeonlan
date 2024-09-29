import { lang } from '$lib/store';

export default {
	'New Device': {
		base: {
			en: 'New Device',
			ja: 'デバイスの追加'
		},
		title: {
			en: 'Add a new device',
			ja: '新しいデバイスの追加'
		},
		desc: {
			en: 'Add a new device to your account',
			ja: 'アカウントに新しいデバイスを追加する'
		},
		forms: {
			name: {
				en: 'Device name',
				ja: 'デバイス名',
				placeholder: {
					en: 'Enter the device name',
					ja: 'デバイス名の入力'
				}
			},
			os: {
				en: 'Operating System',
				ja: 'OS',
			},
			ip: {
				en: 'Host Name / IP Address / Broadcast Address',
				ja: 'ホスト名 / IP アドレス / ブロードキャストアドレス',
				placeholder: {
					en: 'this form is a optional',
					ja: 'このフォームは任意です'
				}
			},
			deviceIP: {
				en: 'Device IP Address',
				ja: 'デバイスのIPアドレス',
				placeholder: {
					en: 'Enter the device IP address',
					ja: 'デバイスの IP アドレスの入力'
				}
			},
			mac: {
				en: 'MAC Address',
				ja: 'MACアドレス',
				placeholder: {
					en: 'Enter the MAC address',
					ja: 'MAC アドレスの入力'
				}
			},
			port: {
				en: 'Number of ports',
				ja: 'ポート',
				placeholder: {
					en: 'Enter the number of ports',
					ja: 'ポート番号'
				}
			},
			save: {
				en: 'Save',
				ja: '保存'
			},
			cancel: {
				en: 'Cancel',
				ja: 'キャンセル'
			}
		}
	},
	Device: {
		loading: {
			en: 'Loading...',
			ja: '読み込み中...'
		},
		isActive: {
			active: {
				en: 'Active',
				ja: 'アクティブ'
			},
			inactive: {
				en: 'Inactive',
				ja: '非アクティブ'
			}
		},
		info: {
			ip: {
				en: 'Device IP',
				ja: 'デバイスの IP アドレス'
			},
			mac: {
				en: 'MAC Address',
				ja: 'MAC アドレス'
			},
			port: {
				en: 'Number of ports',
				ja: 'ポート番号'
			}
		},
		connect: {
			en: 'Connect',
			ja: '接続'
		},
		edit: {
			en: 'Edit',
			ja: '編集'
		}
	},
	Edit: {
		title: {
			en: 'Edit Device',
			ja: 'デバイスの編集'
		},
		desc: {
			en: 'Edit the device information',
			ja: 'デバイス情報の編集'
		},
		forms: {
			delete: {
				en: 'Delete',
				ja: '削除'
			}
		}
	},
	Connect: {
		title: {
			en: 'Connect',
			ja: '接続'
		},
		desc: {
			en: 'Select the type of connection',
			ja: '接続の種類を選択する'
		},
		forms: {
			wol: {
				en: 'Wake on LAN',
				ja: 'Wake on LAN'
			},
			shutdown: {
				en: 'Shutdown',
				ja: 'シャットダウン'
			},
			sleep: {
				en: 'Sleep',
				ja: 'スリープ'
			}
		}
	},
	Delete: {
		title: {
			en: 'Are you sure you want to delete this device?',
			ja: 'このデバイスを削除してもよろしいですか？'
		},
		desc: {
			en: 'This action cannot be undone',
			ja: 'この操作は取り消せません'
		},
		forms: {
			yes: {
				en: 'Yes',
				ja: 'はい'
			},
			no: {
				en: 'No',
				ja: 'いいえ'
			}
		}
	},
	Account: {
		en: 'Account',
		ja: 'アカウント',
		logout: {
			en: 'Log out',
			ja: 'ログアウト'
		},
		login: {
			en: 'Log in',
			ja: 'ログイン'
		}
	},
	Theme: {
		en: 'Theme',
		ja: 'テーマ',
		light: {
			en: 'Light',
			ja: 'ライト'
		},
		dark: {
			en: 'Dark',
			ja: 'ダーク'
		},
		system: {
			en: 'System',
			ja: 'システム'
		}
	},
	Lang: {
		title: {
			en: 'Language',
			ja: '言語'
		},
		ja: {
			en: '日本語',
			ja: 'Japanese'
		},
		en: {
			en: 'English',
			ja: '英語'
		}
	},
	toast: {
		api: {
			wol: {
				success: {
					en: 'Computer woke up',
					ja: 'コンピューターが起動しました'
				},
				error: {
					en: 'Error waking up computer',
					ja: 'コンピューターの起動中にエラーが発生しました'
				}
			},
			shutdown: {
				success: {
					en: 'Computer shut down',
					ja: 'コンピューターがシャットダウンしました'
				},
				error: {
					en: 'Error shutting down computer',
					ja: 'コンピューターのシャットダウン中にエラーが発生しました'
				}
			},
			sleep: {
				success: {
					en: 'Computer went to sleep',
					ja: 'コンピューターがスリープしました'
				},
				error: {
					en: 'Error putting computer to sleep',
					ja: 'コンピューターのスリープ中にエラーが発生しました'
				}
			},
			check: {
				en: 'Please check your connection',
				ja: '接続を確認してください'
			}
		},
		auth: {
			success: {
				en: 'Login successful',
				ja: 'ログインに成功しました'
			},
			error: {
				en: 'Login failed',
				ja: 'ログインに失敗しました'
			},
			logout: {
				en: 'Logged out',
				ja: 'ログアウトしました'
			}
		},
		device: {
			get: {
				login: {
					en: 'Please login to view your device',
					ja: 'デバイスを表示するにはログインしてください'
				}
			},
			add: {
				login: {
					en: 'Please login to add a device',
					ja: 'デバイスを追加するにはログインしてください'
				},
				success: {
					en: 'Device added successfully',
					ja: 'デバイスが正常に追加されました'
				},
				error: {
					en: 'Please fill all the fields',
					ja: 'すべてのフィールドを入力してください'
				}
			},
			edit: {
				login: {
					en: 'Please login to edit your device',
					ja: 'デバイスを編集するにはログインしてください'
				},
				success: {
					en: 'Device edited successfully',
					ja: 'デバイスが正常に編集されました'
				},
				error: {
					en: 'Please fill all the fields',
					ja: 'すべてのフィールドを入力してください'
				}
			},
			delete: {
				login: {
					en: 'Please login to delete your device',
					ja: 'デバイスを削除するにはログインしてください'
				},
				success: {
					en: 'Device deleted successfully',
					ja: 'デバイスが正常に削除されました'
				}
			}
		}
	}
};

export function setLang(lan: 'ja' | 'en') {
	if (typeof window === 'undefined') return;
	localStorage.setItem('lang', lan);
	lang.set(lan);
}

export function getLang() {
	if (typeof window === 'undefined') return;
	return (localStorage.getItem('lang') as 'ja' | 'en') || 'ja';
}