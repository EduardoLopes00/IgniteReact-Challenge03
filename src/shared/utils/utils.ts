export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const dateFormated = `${date.getDate()} ${date.toLocaleString('pt-BR', { month: 'short' })} ${date.getFullYear()}`.replace('.', '');

    return dateFormated;
}