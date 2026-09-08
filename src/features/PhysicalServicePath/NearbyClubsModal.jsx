import styles from './PhysicalServicePath.module.css';

/**
 * NearbyClubsModal
 * ──────────────────
 * Displays 3 demo/mock nearby sports clubs for the user to choose from.
 *
 * PROTOTYPE NOTICE: All club data is fabricated demo data.
 * No real-time location service or maps API is used.
 * This component is architected so a real maps/geolocation service
 * can be wired in by replacing DEMO_CLUBS with live data.
 */

const DEMO_CLUBS = [
  {
    id: 'club_1',
    name: 'نادي الفروسية الرياضي',
    distance: '1.2 كم',
    activityType: 'مشي — سباحة — لياقة عامة',
    tags: ['مناسب لكبار السن', 'يقبل بطاقة تقدير'],
  },
  {
    id: 'club_2',
    name: 'مركز رياضة المجتمع',
    distance: '2.4 كم',
    activityType: 'مشي — يوغا — تمارين هوائية',
    tags: ['دروس جماعية', 'يقبل بطاقة تقدير'],
  },
  {
    id: 'club_3',
    name: 'ملاعب الحي الرياضية',
    distance: '0.8 كم',
    activityType: 'مشي — كرة — رياضات خارجية',
    tags: ['مجاني', 'قريب جدًا'],
  },
];

export function NearbyClubsModal({ onSelectClub, onClose }) {
  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clubs-modal-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 id="clubs-modal-title" className={styles.modalTitle}>
            خيارات قريبة منك
          </h3>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Proto notice */}
        <div className={styles.protoNotice} role="note">
          <span className={styles.protoNoticeIcon} aria-hidden="true">⚠</span>
          <span>
            بيانات تجريبية لأغراض النموذج الأولي — لا تعكس مواقع حقيقية أو
            توفر الخدمة فعليًا. يمكن ربط خدمة خرائط حقيقية لاحقًا.
          </span>
        </div>

        {/* Club list */}
        <ul className={styles.clubList} role="list">
          {DEMO_CLUBS.map((club) => (
            <li key={club.id} className={styles.clubItem} role="listitem">
              <div className={styles.clubInfo}>
                <p className={styles.clubName}>{club.name}</p>
                <p className={styles.clubDistance}>📍 {club.distance}</p>
                <p className={styles.clubActivity}>🏃 {club.activityType}</p>
                <div className={styles.clubTags}>
                  {club.tags.map((tag) => (
                    <span key={tag} className={styles.clubTag}>{tag}</span>
                  ))}
                </div>
              </div>
              <button
                className={styles.clubSelectBtn}
                onClick={() => onSelectClub(club)}
              >
                اختيار
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
