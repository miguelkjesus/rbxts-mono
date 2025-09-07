function runMacros(text: string) {
  const marker = "/// remove-before";
  const index = text.lastIndexOf(marker);

  console.log(index)

  if (index === -1) return text;
  return text.slice(index + marker.length).trimStart();
}

export default runMacros
