# Raleway (100–900 static instances)

The static Raleway faces hosted on Google Fonts have incorrect weight values for Thin and ExtraLight (both
are set to 250), so these were instanced directly from the variable fonts via:

```sh
for w in 100:Thin 200:ExtraLight 300:Light 400:Regular 500:Medium \
         600:SemiBold 700:Bold 800:ExtraBold 900:Black; do
  uvx --from fonttools fonttools varLib.instancer 'Raleway[wght].ttf' \
      wght=${w%%:*} --update-name-table -o "Raleway-${w##*:}.ttf"
done
```
