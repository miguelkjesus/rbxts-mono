function populate(template: string, variables: Record<string, string>) {
  const entries = Object
    .entries(variables)
    .sort(([key0], [key1]) => key1.length - key0.length)

  let lastPass = ""
  let currentPass = template

  while (currentPass !== lastPass) {
    lastPass = currentPass;

    for (const [key, value] of entries) {
      currentPass = currentPass.replaceAll(key, value);
    }
  }

  return currentPass.trim();
}

export default populate
