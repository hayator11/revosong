#!/usr/bin/env python3
import json
import os
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
import requests

# Google Formの設定
FORM_ID = "1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4"

# 環境変数から認証情報を取得
env_path = "/Users/hayatoshinjo/ai-music-charts/.env.local"
api_key_json = None

with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('GOOGLE_SHEETS_API_KEY='):
            api_key_json = line.split('GOOGLE_SHEETS_API_KEY=', 1)[1].strip()
            break

if not api_key_json:
    print("❌ GOOGLE_SHEETS_API_KEY が見つかりません")
    exit(1)

# JSONをパース
try:
    service_account_info = json.loads(api_key_json)
except json.JSONDecodeError as e:
    print(f"❌ JSONパースエラー: {e}")
    exit(1)

# 認証情報を取得
credentials = Credentials.from_service_account_info(
    service_account_info,
    scopes=['https://www.googleapis.com/auth/forms']
)

# アクセストークンを取得
credentials.refresh(Request())
access_token = credentials.token

print(f"✓ Google Forms APIで認証成功")

# フォームの現在のデータを取得
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

get_url = f"https://forms.googleapis.com/v1/forms/{FORM_ID}"
response = requests.get(get_url, headers=headers)

if response.status_code != 200:
    print(f"❌ フォーム取得エラー: {response.status_code}")
    print(response.text)
    exit(1)

form_data = response.json()
print(f"✓ フォーム取得成功")
print(f"  タイトル: {form_data.get('info', {}).get('title')}")

# 既存の質問を確認
existing_questions = []
if 'items' in form_data:
    for item in form_data['items']:
        if 'title' in item:
            existing_questions.append(item.get('title', ''))

print(f"✓ 既存の質問数: {len(existing_questions)}")
for q in existing_questions:
    print(f"  - {q}")

# 追加する質問項目の定義
questions_to_add = [
    {
        'title': '申請者名',
        'questionItem': {
            'question': {
                'required': True,
                'textQuestion': {
                    'paragraph': False
                }
            }
        }
    },
    {
        'title': 'REVOSONGユーザー名',
        'questionItem': {
            'question': {
                'required': True,
                'textQuestion': {
                    'paragraph': False
                }
            }
        }
    },
    {
        'title': '申請タイプ',
        'questionItem': {
            'question': {
                'required': True,
                'choiceQuestion': {
                    'type': 'RADIO',
                    'options': [
                        {'value': '自薦'},
                        {'value': '他薦'}
                    ]
                }
            }
        }
    },
    {
        'title': 'テーマタイトル',
        'questionItem': {
            'question': {
                'required': True,
                'textQuestion': {
                    'paragraph': False
                }
            }
        }
    },
    {
        'title': 'テーマ説明',
        'questionItem': {
            'question': {
                'required': True,
                'textQuestion': {
                    'paragraph': True
                }
            }
        }
    },
    {
        'title': 'どのような応援がしてほしい/したいのか',
        'questionItem': {
            'question': {
                'required': False,
                'textQuestion': {
                    'paragraph': True
                }
            }
        }
    },
    {
        'title': '対象者やコミュニティ',
        'questionItem': {
            'question': {
                'required': False,
                'textQuestion': {
                    'paragraph': False
                }
            }
        }
    },
    {
        'title': '参考になる曲やURL',
        'questionItem': {
            'question': {
                'required': False,
                'textQuestion': {
                    'paragraph': False
                }
            }
        }
    },
    {
        'title': '追加コメント',
        'questionItem': {
            'question': {
                'required': False,
                'textQuestion': {
                    'paragraph': True
                }
            }
        }
    }
]

# 質問を追加
batch_update_url = f"https://forms.googleapis.com/v1/forms/{FORM_ID}:batchUpdate"

requests_list = []
for question in questions_to_add:
    requests_list.append({
        'createItem': {
            'item': question,
            'location': {
                'index': len(existing_questions) + len(requests_list)
            }
        }
    })

payload = {
    'requests': requests_list
}

response = requests.post(batch_update_url, headers=headers, json=payload)

if response.status_code != 200:
    print(f"❌ 質問追加エラー: {response.status_code}")
    print(response.text)
    exit(1)

print(f"✓ 質問項目を追加しました ({len(questions_to_add)}件)")

# 完成したフォームのURLを表示
print(f"\n✅ Google Form設定完了！")
print(f"フォーム URL: https://docs.google.com/forms/d/{FORM_ID}")
print(f"\n【追加した質問項目】")
for i, q in enumerate(questions_to_add, 1):
    print(f"{i}. {q['title']}")
