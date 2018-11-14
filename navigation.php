<nav>
    {% set navSection = 'headerNav' %}
    {% set navElement = '__item' %}
    {% set levelPrefix = '--level' %}

    <ul class="{{ navSection }}">
        
        {% set headerNavEntries = craft.entries.section(navSection).all() ?? null %}
        {% if headerNavEntries %}
                {% nav entry in headerNavEntries %}
        
                {% set navLevel = entry.level %}
                {# Combine levelPrefix string with current entry.level #}
                {% set modName = levelPrefix ~ navLevel %}
        
                <li class="{{ navSection ~ navElement }}">
                    {# Grab anchor from entry field #}
                    <a href="{{ entry.navLink[0].getUrl() }}" class="{{ navSection }}__itemLink">{{ entry.title }}</a>
                    {# Check for children #}
                    {% ifchildren %}
                        <ul class="{{ navSection }}{% if navLevel > 0 %} {{navSection ~ modName }}{% endif %}">
                            {% children %}
                        </ul>
                    {% endifchildren %}
                </li>
        
                {% endnav %}
        {% endif %}
        
    </ul>
</nav>
