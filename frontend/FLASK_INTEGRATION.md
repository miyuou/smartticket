# Intégration avec Flask Backend

## Configuration automatique
Le frontend est configuré pour se connecter automatiquement à votre backend Flask :
- **Développement** : `http://127.0.0.1:5000`
- **Production** : Modifiez l'URL dans `src/api/config.ts`

## Configuration Flask requise

Pour que votre backend Flask fonctionne avec ce frontend, ajoutez ceci à votre backend :

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
```

## Endpoints attendus par le frontend

✅ **Authentification**
- `POST /auth/login` → `{"access_token": "...", "user": {...}}`

✅ **Tickets**
- `GET /tickets` → Liste des tickets
- `POST /tickets` → Créer un ticket
- `PUT /tickets/<id>` → Modifier un ticket
- `DELETE /tickets/<id>` → Supprimer un ticket

✅ **Utilisateurs (admin)**
- `GET /users` → Liste des utilisateurs
- `POST /users` → Créer un utilisateur
- `PUT /users/<id>` → Modifier un utilisateur
- `DELETE /users/<id>` → Supprimer un utilisateur

✅ **Statistiques**
- `GET /stats` → Statistiques du dashboard

✅ **Import/Export**
- `POST /import_export/import` → Upload CSV
- `GET /import_export/export` → Download CSV

✅ **Référentiels**
- `GET /categories` → Liste des catégories
- `GET /statuts` → Liste des statuts  
- `GET /types` → Liste des types

## Démarrage
```bash
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`