/** `tel:` 用に空白を除去 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
