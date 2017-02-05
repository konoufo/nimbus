from django import template


register = template.Library()


@register.filter
def dictvalue(d, k):
    return d.get(k, '')
