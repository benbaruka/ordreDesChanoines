import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

class DateFormatter {
  // Méthode sécurisée pour parser les dates
  static safeParse(dateString?: string): Date | null {
    try {
      if (!dateString) return null;
      return parseISO(dateString);
    } catch {
      return null;
    }
  }

  // Format: Mardi 13, Mars 2024
  static formatDateLong(dateString?: string): string {
    const date = this.safeParse(dateString);
    return date
      ? format(date, 'EEEE dd, MMMM yyyy', { locale: fr })
      : 'Date inconnue';
  }

  // Format: 13/03/2024
  static formatDateShort(dateString?: string): string {
    const date = this.safeParse(dateString);
    return date ? format(date, 'dd/MM/yyyy') : '—';
  }

  // Format: 10:53, 13 Mars
  static formatTimeAndDay(dateString?: string): string {
    const date = this.safeParse(dateString);
    return date ? format(date, 'HH:mm, dd MMMM', { locale: fr }) : '—';
  }

  // Format ISO: 2025-03-13T10:53:39.312Z
  static formatISO(dateString?: string): string {
    const date = this.safeParse(dateString);
    return date ? date.toISOString() : '';
  }
}

export default DateFormatter;
