<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $listings = [
            [
                'Développeur Full-Stack React / Laravel', 'TechInnov SARL', 'techinnov', '#2563eb', 'Cotonou, Bénin', 'CDI',
                'Nous recherchons un développeur passionné pour concevoir et maintenir nos applications web. Maîtrise de React et Laravel exigée.',
                'Nous recherchons un développeur full-stack passionné pour rejoindre notre équipe technique et participer à la conception, au développement et à la maintenance de nos applications web. Vous travaillerez en étroite collaboration avec les équipes produit et design pour livrer des fonctionnalités de qualité.',
                ['Concevoir et développer de nouvelles fonctionnalités sur nos applications web', 'Participer à la conception technique et à l\'architecture des projets', 'Rédiger un code propre, testé et documenté', 'Collaborer avec les équipes design et produit', 'Assurer la maintenance et l\'évolution du code existant'],
                ['Bac +3 à Bac +5 en informatique ou équivalent', '2 ans d\'expérience minimum en développement web', 'Maîtrise de React, Laravel et MySQL', 'Connaissance de Git et des bonnes pratiques de versioning', 'Autonomie, rigueur et esprit d\'équipe'],
                ['Rémunération compétitive selon profil', 'Télétravail partiel possible (2 jours / semaine)', 'Formation continue et veille technologique', 'Ambiance collaborative et bienveillante', 'Mutuelle santé et tickets restaurant'],
            ],
            [
                'Designer UI / UX', 'Studio Créatif', 'studio-creatif', '#7c3aed', 'Paris, France', 'CDD',
                'Concevez des interfaces élégantes et intuitives pour nos clients. Portfolio et maîtrise de Figma requis.',
                'Vous concevrez des interfaces élégantes, intuitives et accessibles pour nos clients. Vous participerez à toutes les étapes de la conception, de la recherche utilisateur à la livraison des maquettes finales.',
                ['Concevoir des maquettes et prototypes haute-fidélité', 'Mener des recherches utilisateur et des tests d\'usabilité', 'Collaborer étroitement avec les développeurs', 'Maintenir et faire évoluer notre design system', 'Présenter vos travaux aux clients et recueillir les retours'],
                ['Formation en design graphique, UI/UX ou équivalent', 'Portfolio solide démontrant votre créativité', 'Maîtrise de Figma et Adobe Creative Suite', 'Sensibilité aux enjeux d\'accessibilité', 'Excellente communication écrite et orale'],
                ['Environnement créatif et stimulant', 'Projets variés et clients prestigieux', 'Horaires flexibles', 'Matériel de travail fourni'],
            ],
            [
                'Assistant Marketing Digital', 'Growth Agency', 'growth-agency', '#10b981', 'Abidjan, Côte d\'Ivoire', 'Stage',
                'Participez à la stratégie digitale : réseaux sociaux, campagnes publicitaires et analyse de performance.',
                'En tant qu\'assistant marketing digital, vous participerez activement à la mise en œuvre de la stratégie digitale de nos clients : animation des réseaux sociaux, création de campagnes publicitaires et analyse des performances.',
                ['Animer les réseaux sociaux (Facebook, Instagram, LinkedIn)', 'Créer et optimiser des campagnes publicitaires en ligne', 'Analyser les performances et proposer des optimisations', 'Rédiger des contenus attractifs adaptés à chaque canal', 'Veille concurrentielle et tendances digitales'],
                ['Étudiant en marketing, communication ou commerce', 'Passionné par le digital et les réseaux sociaux', 'Bonne qualité rédactionnelle', 'Maîtrise des outils Google Analytics et Meta Business', 'Curiosité et proactivité'],
                ['Stage rémunéré avec possibilité d\'embauche', 'Formation continue à nos outils', 'Ambiance jeune et dynamique', 'Tickets restaurant'],
            ],
            [
                'Développeur Mobile Flutter', 'AppFactory', 'appfactory', '#ea580c', 'Dakar, Sénégal', 'Freelance',
                'Développez une application mobile multiplateforme. Expérience Flutter et publication sur les stores appréciée.',
                'Nous recherchons un développeur Flutter expérimenté pour développer une application mobile multiplateforme à destination de nos clients. Mission freelance de 3 mois renouvelable.',
                ['Développer une application mobile iOS et Android', 'Intégrer les APIs REST du back-end', 'Assurer la qualité et les performances de l\'application', 'Publier et maintenir l\'application sur les stores', 'Travailler en autonomie avec des points réguliers'],
                ['Expérience confirmée avec Flutter et Dart', 'Expérience de publication sur App Store et Play Store', 'Bonne connaissance des bonnes pratiques mobiles', 'Capacité à travailler en autonomie', 'Portfolio de projets mobiles apprécié'],
                ['Taux journalier attractif', 'Mission longue avec possibilité de renouvellement', 'Travail 100 % à distance', 'Équipe technique expérimentée'],
            ],
            [
                'Responsable Ressources Humaines', 'Groupe Horizon', 'groupe-horizon', '#0ea5e9', 'Lomé, Togo', 'CDI',
                'Encadrez la politique RH, le recrutement et la gestion des talents au sein d\'un groupe en pleine croissance.',
                'Vous piloterez la politique RH d\'un groupe en pleine croissance et accompagnerez son développement en matière de recrutement, de gestion des talents et de développement des compétences.',
                ['Piloter la stratégie de recrutement et d\'intégration', 'Gérer les carrières et la formation des collaborateurs', 'Assurer la gestion administrative du personnel', 'Développer la marque employeur', 'Conseiller la direction sur les enjeux RH'],
                ['Bac +5 en RH, gestion ou équivalent', '5 ans d\'expérience en RH dont 2 en management', 'Excellente connaissance du droit du travail', 'Aisance relationnelle et sens de l\'écoute', 'Maîtrise des SIRH'],
                ['Poste à responsabilités dans un groupe dynamique', 'Package salarial attractif', 'Voiture de fonction', 'Formation continue'],
            ],
            [
                'Data Analyst Junior', 'DataSense', 'datasense', '#dc2626', 'Télétravail', 'CDD',
                'Analysez les données clients, produisez des tableaux de bord et appuyez la prise de décision stratégique.',
                'Rejoignez notre équipe data pour analyser les données de nos clients, produire des tableaux de bord et accompagner la prise de décision stratégique.',
                ['Collecter, nettoyer et analyser les données clients', 'Créer des tableaux de bord et rapports réguliers', 'Identifier les tendances et opportunités', 'Présenter vos analyses aux équipes métier', 'Participer à l\'amélioration continue de nos outils'],
                ['Bac +3 à Bac +5 en statistiques, data ou équivalent', 'Maîtrise de SQL et d\'un outil de BI (Power BI, Tableau)', 'Bonne connaissance de Python ou R', 'Esprit d\'analyse et de synthèse', 'Capacité à vulgariser des analyses complexes'],
                ['100 % télétravail', 'Matériel fourni', 'Formation continue', 'Ambiance collaborative'],
            ],
        ];

        foreach ($listings as [$title, $company, $slug, $color, $location, $contract, $description, $longDescription, $missions, $profile, $benefits]) {
            $employer = User::firstOrCreate(
                ['email' => $slug.'@example.invalid'],
                [
                    'name' => $company,
                    'password' => Hash::make(Str::random(48)),
                    'role' => 'employeur',
                    'company_name' => $company,
                    'location' => $location,
                ],
            );

            Offer::firstOrCreate(
                ['employer_id' => $employer->id, 'title' => $title],
                [
                    'description' => $description,
                    'long_description' => $longDescription,
                    'location' => $location,
                    'contract' => $contract,
                    'missions' => $missions,
                    'profile' => $profile,
                    'benefits' => $benefits,
                    'color' => $color,
                    'status' => 'active',
                ],
            );
        }
    }
}
